const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')

router.route('/')
  .get(getProducts)
  .post(protect, createProduct)

router.route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct)

module.exports = router
