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

// get single product
exports.getSingleProductController = async (req, res) => {
    try {
      const product = await productModel
        .findOne({ _id: req.params.id })
        .select("-photo")
      res.status(200).send({
        success: true,
        message: "Single Product Fetched",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror while getitng single product",
        error,
      });
    }
  };

  // get photo
exports.productPhotoController = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.pid).select("photo");
      if (product.photo.data) {
        res.set("Content-type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Erorr while getting photo",
        error,
      });
    }
  };

  
//delete controller
exports.deleteProductController = async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.pid).select("-photo");
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };

  //upate producta
exports.updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, shipping } = req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields},
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};