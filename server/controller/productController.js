const productModel = require('../models/productModel')
const fs = require('fs')

exports.createProductController = async (req,res) => {
 try{
    const {name,description,price,quantity,shipping} = req.fields
    const {photo}= req.files
    // validation
    if(!name && !description && !price && !quantity  &&!photo){
        res.status(500).send('Please fill the form completely')
        if(photo.size >1000000){
        res.status(500).res.send('Photo should be less than 1mb')
        }
    }else{
        const product = new productModel({...req.fields})
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.status(201).send({
            success:true,
            message: 'Product Created Successfully',
            product
        })
    }
 }catch(err){
    console.log(err);
    res.status(500).send({
        success: false,
        err,
        message:'Error in creating product'
    })

 }
}

// get all products
exports.getProducts = async(req,res)=>{
    try{
     const products = await productModel.find({}).select("-photo").limit(12).sort({createdAt:-1})
     res.status(200).send({
        success: true,
        message: 'All products',
        products
     })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in getting products',
            err: err.message
        })
    }
}