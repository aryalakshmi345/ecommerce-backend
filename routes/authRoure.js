const express = require('express')
const authController = require('../controller/authController.js')
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware.js')


const router = express.Router()

// routing
//register || method postMessagerouter
router.post('/users/register',authController.registerController)

// login
router.post('/users/login',authController.loginController)

// test routes
router.get('/test', requireSignIn,isAdmin,authController.testcontroller)


// protected user route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ ok: true})
})

// protected admin route auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ ok: true})
})

module.exports = router