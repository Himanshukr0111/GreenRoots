const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a plant or product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please specify a price in INR'],
      min: [0, 'Price must be positive'],
    },
    availableQty: {
      type: Number,
      default: 5,
      min: [0, 'Available quantity cannot be negative'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sellerName: {
      type: String,
      default: 'Neighbourhood Grower',
      trim: true,
    },
    sellerType: {
      type: String,
      default: 'Balcony Gardener',
      trim: true,
    },
    locality: {
      type: String,
      default: 'Indiranagar, Bengaluru',
      trim: true,
    },
    distanceKm: {
      type: Number,
      default: 1.5,
    },
    pickupAvailable: {
      type: Boolean,
      default: true,
    },
    sellerDelivery: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
      default: 'Healthy & Fresh',
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide a product photo'],
    },
    description: {
      type: String,
      required: [true, 'Please provide care and product details'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for high-performance text and locality search
productSchema.index({ name: 'text', category: 'text', description: 'text', locality: 'text' })

module.exports = mongoose.model('Product', productSchema)
