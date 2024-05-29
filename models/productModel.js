const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
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
    },
    quantity:{
        type:String,
        required:true
    },
    photo:{
        data: Buffer,
        contentType : String
    },
    shipping:{
        type:Boolean,
    },
},{timestamps:true})

const products = mongoose.model('products',productSchema)
module.exports = products