const express = require('express')
const cartController = require('../controller/cartController')
const { requireSignIn } = require('../middlewares/authMiddleware')
const router = express.Router()

// add to cart
router.post('/add-to-cart/:id',requireSignIn,cartController.addToCart)

// get cart products
router.get('/get-cart-products/:id',requireSignIn,cartController.getCartProduct)

// delete cart products
router.delete('/delete-cart-product/:id',cartController.removeCartProduct)

// delete user cart products
router.delete('/delete-user-cart/:id',cartController.removeUserCartProduct)


module.exports = router
