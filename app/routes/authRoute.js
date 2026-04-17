const express = require('express')

const router = express.Router()

const authController = require('../controller/autController')

// const authCheck = require('../middleware/userAuthCheck')


router.post('/register/user', authController.userRegister)
router.post('/verify',authController.verify)
router.post('/login/user', authController.userLogin)

//reset password
router.post('/reset-password-link',authController.resetPasswordLink);
router.post('/reset-password/:id/:token',authController.resetPassword)

module.exports = router