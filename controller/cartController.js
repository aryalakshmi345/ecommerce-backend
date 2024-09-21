const cartModel = require('../models/cartModel')

exports.addToCart = async(req,res)=>{
    try{   
    const userId = req.params.id
    const {productId,quantity,name,description,price} = req.body
    if(!userId || !productId || !quantity || !name || !description || !price){
        res.status(500).send('Invalid data')
        console.log('invalid data');
    }else{
        const cart =  new cartModel({userId,productId,quantity,name,description,price})
        await cart.save()
        res.status(201).send({
            success:true,
            message:'Product added to cart',
            cart
        })
    }}catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message:'Error in cart',
            err
        })
    }
}

// get cart products
exports.getCartProduct = async(req,res)=>{
    try{
        const userId = req.params.id
        const cartProducts = await cartModel.find({userId})
        res.status(200).send({
            success:true,
            message:'cart products fetched successfully',
            cartProducts
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'an unknown error occures',
            err
        })
    }
}

// delete cart products
exports.removeCartProduct = async(req,res)=>{
    try{
      const cartId = req.params.id
      await cartModel.findByIdAndDelete(cartId)
      res.status(200).send({
        success: true,
        message:'Cart item succesfully deleted!',
      })
    }catch(err){
        res.status(500).send({
            message: "Error in product deletion",
            err
        })
    }
}

// delete user cart prooducts
exports.removeUserCartProduct = async(req,res)=>{
    try{
      const userId = req.params.id
      await cartModel.deleteMany({userId:userId})
      res.status(200).send({
        success: true,
        message:'Cart items succesfully deleted!',
      })
    }catch(err){
        res.status(500).send({
            message: "Error in product deletion",
            err
        })
    }
}