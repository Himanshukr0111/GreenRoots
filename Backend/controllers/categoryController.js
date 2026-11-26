const Category = require('../models/Category')

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json({
      success: true,
      count: categories.length,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, subtitle, image, popularIn } = req.body

    if (!name || !image) {
      res.status(400)
      throw new Error('Please provide category name and image')
    }

    const category = await Category.create({
      name: name.trim(),
      slug: slug ? slug.trim().toLowerCase() : name.toLowerCase().replace(/\s+/g, '-'),
      subtitle: subtitle?.trim() || '',
      image,
      popularIn: popularIn?.trim() || 'Home & Balcony',
    })

    res.status(201).json({
      success: true,
      category,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCategories,
  createCategory,
}
