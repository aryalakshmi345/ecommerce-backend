const express = require('express')
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware')
const  productController  = require('../controller/productController')
const formidable = require('express-formidable')
const router = express.Router()

// routes
// create products
router.post('/create-products', requireSignIn,isAdmin,formidable(),productController.createProductController)

// get all products
router.get('/get-products',productController.getProducts)

//single product
router.get("/get-product/:id", productController.getSingleProductController);

 //get photo
router.get("/product-photo/:pid", productController.productPhotoController);

//delete rproduct
router.delete("/product-delete/:pid", productController.deleteProductController);

// update product
router.put("/products/update/:id",requireSignIn,isAdmin,formidable(), productController.updateProductController)

module.exports = router