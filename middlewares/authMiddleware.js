const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

// protected routr token base
exports.requireSignIn = async (req,res,next) => {
    try{
    const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    req.user = decode
    next()
    }catch(error){
        console.log(error);
    }
}

// admin access
exports.isAdmin = async(req,res,next)=>{
    try{
        const user = await userModel.findById(req.user._id)
        if(user.role !==1){
            return res.status(401).send({
                success:false,
                message:'Unauthorised Access'
            })
        }else{
            next()
        }
    }catch(err){
        console.log(err);
        res.status(401).send({
            success:false,
            message:'Error in admin middleware'
        })
    }
} 