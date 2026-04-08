const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const autCheck = require('../middleware/userAuthCheck')

//product routes (CRUD)

router.use(autCheck)

router.post('/create-product', autCheck, productController.createProduct)
router.get('/products', autCheck, productController.getAllProducts)
router.put('/product/update/:id', autCheck, productController.updateProduct)
router.delete('/product/delete/:id', autCheck, productController.deleteProduct)


module.exports = router