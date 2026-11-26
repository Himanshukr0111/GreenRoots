const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Please provide a category slug'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide a category image URL'],
    },
    popularIn: {
      type: String,
      default: 'Home & Balcony',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Category', categorySchema)
