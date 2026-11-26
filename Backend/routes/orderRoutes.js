const express = require('express')
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController')
const { protect, optionalAuth } = require('../middleware/authMiddleware')

router.route('/')
  .post(optionalAuth, createOrder)

router.get('/my-orders', protect, getMyOrders)
router.get('/:id', optionalAuth, getOrderById)

module.exports = router
