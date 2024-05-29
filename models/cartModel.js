const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true 
    },
    name:{
        type:String,
        required:true  
    },
    description:{
        type:String,
        required:true  
    },
    price:{
        type:String,
        required:true  
    }
})

const cart = mongoose.model('cart',cartSchema)
module.exports = cart