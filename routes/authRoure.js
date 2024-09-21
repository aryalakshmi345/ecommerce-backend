const express = require('express')
const authController = require('../controller/authController.js')
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware.js')
const formidable = require('express-formidable')


const router = express.Router()

// routing
//register || method postMessagerouter
router.post('/users/register',authController.registerController)

// verify otp
router.post('/verify-otp',authController.verifyOtp)

// resend otp
router.post('/resend-otp',authController.resendOTP)


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

// get users route path
router.get('/admin/users',authController.getUsersController)

// update profile
router.put("/user/edit-profile/:id",requireSignIn,formidable(), authController.updateUserController)

// get users route path
router.get('/user/profile/:id',authController.getUserDetailsController)


 //get photo
 router.get("/profile-photo/:pid", authController.userPhotoController);

//get orders
router.get("/user/get-orders/:id",authController.getUserOrders)

//get all orders
router.get("/admin/get-all-orders",authController.getAllOrders)

// update order status
router.put("/admin/update-order-status/:id",requireSignIn, authController.orderStatusController)

// router.post('/send-register-otp', authController.sendRegisterOTP)



module.exports = router