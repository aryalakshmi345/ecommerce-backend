const express = require('express')
const authController = require('../controller/authController.js')


const router = express.Router()

// routing
//register || method postMessagerouter
router.post('/register',authController.registerController)

module.exports = router