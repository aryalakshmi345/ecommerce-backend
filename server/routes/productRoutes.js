const express = require('express')
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware')
const  productController  = require('../controller/productController')
const formidable = require('express-formidable')
const router = express.Router()

// routes
// create products
router.post('/create-product', requireSignIn,isAdmin,formidable(),productController.createProductController)

// get all products
router.get('/get-products',productController.getProducts)

module.exports = router