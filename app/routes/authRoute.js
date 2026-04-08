const express = require('express')

const router = express.Router()

const authController = require('../controller/autController')

const authCheck = require('../middleware/userAuthCheck')


router.post('/register/user', authController.userRegister)
router.post('/verify',authController.verify)
router.post('/login/user', authController.userLogin)

module.exports = router