const { hashPassword, comparePassword } = require('../helpers/authHelper')
const userModel = require('../models/userModel')
const orderModel = require('../models/orderModel')
const OTP = require('../models/otp')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const otpGenerator = require('otp-generator')
const sendOtpVerificationEmail = require('../helpers/mailservice')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')




exports.registerController = async(req,res) =>{
    try{
       const {name,email,password} = req.body
    //    validators
    if(!name && !email && !password){
        return res.send({error:'Please enter all fields!'})
    } 
    // check user
    const existingUser = await userModel.findOne({email})
    if(existingUser){
        return res.status(200).send({
            success:true,
            message: 'Already registered please login'

        })
    }else{
    const hashedPassword = await hashPassword(password)
    const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    const user = new userModel({
      name,
      email,
      password:hashedPassword,
      otp,
      otpExpires
    })
    await user.save()
    
    await sendOtpVerificationEmail(email, otp);
    res.status(200).json({ message: 'OTP sent to your email. Please verify your account.' });
  }
    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',err
        })
    }
}

// verify otp
exports.verifyOtp = async (req, res) => {
  console.log("Inside vrify otp");
  
  const { email, otp } = req.body;

  try {
      // Find the user by email
      const user = await userModel.findOne({ email });

      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      // Check if OTP is correct
      if (user.otp !== otp) {
          return res.status(400).json({ message: 'Invalid OTP' });
      }

       // Check if OTP is expired
       const now = new Date();
       if (user.otpExpires < now) {
           return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
       }

      // Update user to set verified
      user.isVerified = true;
      user.otp = null; // Clear OTP after verification

      await user.save();

      res.status(200).json({ message: 'Account verified successfully!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
}

// resend otp
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
      // Check if the user exists
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      // Check if user is already verified
      if (user.isVerified) {
          return res.status(400).json({ message: 'Account already verified' });
      }

      // Check if OTP is still valid or expired
      const now = new Date();
      if (user.otp && user.otpExpires > now) {
          return res.status(400).json({ message: 'OTP is still valid. Please check your email.' });
      }

      // Generate new OTP
      const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      

      // Update user's OTP and expiration time
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // Resend the OTP via email
      await sendOtpVerificationEmail(user.email, otp);

      res.status(200).json({ message: 'New OTP sent to your email.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
}


// login post
exports.loginController = async(req,res)=>{
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'Please fill the form completely'
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message:'Email is not registerd'
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(404).send({
                success: false,
                message: "incorrect password"
            })
        }
        // token
        const token = await jwt.sign({_id: user._id},process.env.JWT_SECRET,{
            expiresIn: "7d"
        })
        res.status(200).send({
            success:true,
            message:"Login succesful",
            user:{
                id: user._id,
                name: user.name,
                email:user.email,
                phone:user.phone,
                address: user.address,
                role: user.role
            },
            token
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message:'Error in login',
            err
        })

    }
}

// test controller
exports.testcontroller = async(req,res)=>{
    res.send('Protected Routes')
}

// get users
exports.getUsersController = async(req,res)=>{
    try{
    const users = await userModel.find({ "name": { "$ne": "Admin" } })
    res.status(200).send({
        success: true,
        message:'Users details fetched successfully!',
        users
    })
   }catch(err){
    res.status(500).send({
        success:false,
        message:'Error occured',
        err
    })
   }
}


  //upate profile
  exports.updateUserController = async (req, res) => {
    try {
      const { name, phone, address } = req.fields;
      const { photo } = req.files;
      //alidation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !phone:
          return res.status(500).send({ error: "Phone is Required" });
        case !address:
          return res.status(500).send({ error: "Address is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        { ...req.fields},
        { new: true }
      );
      if (photo) {
        user.photo.data = fs.readFileSync(photo.path);
        user.photo.contentType = photo.type;
      }
      await user.save();
      res.status(201).send({
        success: true,
        message: "Profile Updated Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Update profile",
      });
    }
  };

  // get a user
  exports.getUserDetailsController = async(req, res)=>{
    try{
      const id = req.params.id
      const user = await userModel.findById(id)
      res.status(200).send({
          success: true,
          message:'Users details fetched successfully!',
          user
      })
     }catch(err){
      console.log(err);
      res.status(500).send({
          success:false,
          message:'Error occured',
          err
      })
     }
  }

    // get photo
exports.userPhotoController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.pid).select("photo");
    if (user.photo.data) {
      res.set("Content-type", user.photo.contentType);
      return res.status(200).send(user.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }};

  

// get orders
exports.getUserOrders = async(req,res)=>{
  try{
    const id = req.params.id
    const orders = await orderModel.find({buyer: id }).populate("products", "-photo").populate("buyer", "name");
    if(orders){
      res.status(200).json({
        success: true,
        message:'Ordered Items are fetched successfully',
        orders
      })
    }else{
      res.status(404).res.send("No orders")
    }
  }catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      message:'Error in getting orders',
      err
    })
  }
}

// get all orders
exports.getAllOrders = async(req,res)=>{
  try{
    const orders = await orderModel.find().populate("products", "-photo").populate("buyer", "name");
    res.status(200).send({
      success: true,
      message:'Orders are fetched successfully!',
      orders
    })
  }catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      message:'Error in fetching orders',
      err
    })
  }
}


// update order status
exports.orderStatusController = async (req, res) => {
  try {
    const  orderId  = req.params.id;
    const {status}   = req.body
    console.log(status);
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
       {status} ,
      { new: true }
    );
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};

// forget password controller
exports.forgetPasswordontroller = async(req,res)=>{
  const {email} = req.body
  try{
    const user = await userModel.findOne({email})
  if(!user){
    res.status(404).json({message:"User not found"})
  }else{
    const resetToken = jwt.sign({id:user._id},"supersecretkey12345",{expiresIn:'10m'})

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    // Send the reset email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use other providers
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset</p>
             <p>Click this <a href="${resetUrl}">link</a> to reset your password. This link is valid for 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({message:"Reset link sent to your email address."})
  }
}
catch(err){
  res.status(500).json('Internal Server Error')
  console.log(err);
}
}

// reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token,"supersecretkey12345");
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired' });
    }
    res.status(500).json({ message: 'Server error', error });
    console.log(error);
    
  }
};