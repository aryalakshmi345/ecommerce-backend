const { hashPassword } = require('../helpers/authHelper')
const userModel = require('../models/userModel')

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

