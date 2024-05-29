const { hashPassword, comparePassword } = require('../helpers/authHelper')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')


exports.registerController = async(req,res) =>{
    try{
       const {name,email,password,phone,address} = req.body
    //    validators
    if(!name && !email && !password && !phone && !address){
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
            // register user
    const hashedPassword = await hashPassword(password)
    // save
    const user =  new userModel({name,email,password:hashedPassword,phone,address})
    await user.save()
    res.status(201).send({
        success:true,
        message:"User register successfully",
        user
    })
    }

    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',err
        })
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