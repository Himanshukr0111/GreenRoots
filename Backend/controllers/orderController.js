const mongoose = require('mongoose')
const Order = require('../models/Order')

// @desc    Create new order / pickup inquiry
// @route   POST /api/orders
// @access  Public (Guest or Logged in User)
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      buyerName,
      buyerEmail,
      buyerPhone,
      locality,
      totalAmount,
      deliveryType,
      notes,
    } = req.body

    if (!items || !items.length) {
      res.status(400)
      throw new Error('No order items provided in the basket')
    }

    if (!buyerName || !buyerEmail) {
      res.status(400)
      throw new Error('Please provide buyer name and email address')
    }

    if (typeof buyerEmail !== 'string' || typeof buyerName !== 'string') {
      res.status(400)
      throw new Error('Invalid input format')
    }

    const order = await Order.create({
      buyer: req.user ? req.user._id : null,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.toLowerCase().trim(),
      buyerPhone: typeof buyerPhone === 'string' ? buyerPhone.trim() : '',
      locality: typeof locality === 'string' && locality.trim() ? locality.trim() : 'Bengaluru, India',
      items: items.map((i) => {
        const rawId = i.product?._id || i.product?.id || i.product
        const validProductId = mongoose.Types.ObjectId.isValid(rawId)
          ? rawId
          : new mongoose.Types.ObjectId()

        return {
          product: validProductId,
          name: i.product?.name || i.name || 'Garden Item',
          price: Number(i.product?.price || i.price || 0),
          quantity: Number(i.quantity || 1),
          image: i.product?.image || i.image || '',
        }
      }),
      totalAmount: Number(totalAmount) || 0,
      deliveryType: deliveryType === 'delivery' ? 'delivery' : 'pickup',
      notes: typeof notes === 'string' ? notes.trim() : '',
    })

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully. Local neighbours have been notified for coordination!',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 })
    res.json({
      success: true,
      count: orders.length,
      orders,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Buyer or Admin) / Public fallback
const getOrderById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404)
      throw new Error('Invalid Order ID')
    }

    const order = await Order.findById(req.params.id).populate('buyer', 'name email role')

    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    // If order has an associated buyer and requester is authenticated, check authorization
    if (order.buyer && req.user) {
      const isBuyer = order.buyer._id.toString() === req.user._id.toString()
      const isAdmin = req.user.role === 'Admin'
      if (!isBuyer && !isAdmin) {
        res.status(403)
        throw new Error('Not authorized to view this order')
      }
    }

    res.json({
      success: true,
      order,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
}
