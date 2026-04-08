const express = require('express')

const router = express.Router()


const productRoute = require('../routes/productRoute')

const authRoute = require('../routes/authRoute')


router.use(productRoute)
router.use(authRoute)


module.exports = router