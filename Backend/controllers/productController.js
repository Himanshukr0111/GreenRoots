const Product = require('../models/Product')
const { isCloudinaryConfigured, uploadToCloudinary } = require('../config/cloudinary')

// @desc    Fetch all products with keyword search and category/price filtering
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, locality } = req.query

    // Build query object
    const filter = {}

    // Keyword search across title, description, category, and locality
    if (keyword && keyword.trim()) {
      const q = keyword.trim()
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { locality: { $regex: q, $options: 'i' } },
        { sellerName: { $regex: q, $options: 'i' } },
      ]
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category
    }

    // Price range filters
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // Locality filter
    if (locality) {
      filter.locality = { $regex: locality, $options: 'i' }
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate('seller', 'name email role')

    res.json({
      success: true,
      count: products.length,
      products,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email role locality')

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    res.json({
      success: true,
      product,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a new product listing (Seller)
// @route   POST /api/products
// @access  Private (Registered user/seller)
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      price,
      description,
      image,
      availableQty,
      locality,
      pickupAvailable,
      sellerDelivery,
      tag,
    } = req.body

    if (!name || !price || !category || !description) {
      res.status(400)
      throw new Error('Please provide name, price, category, and description')
    }

    let finalImageUrl = image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=85'

    // If Base64 image is submitted and Cloudinary is configured, upload to Cloudinary
    if (typeof finalImageUrl === 'string' && finalImageUrl.startsWith('data:image/') && isCloudinaryConfigured()) {
      try {
        const uploadRes = await uploadToCloudinary(finalImageUrl, {
          folder: 'greenroots/products',
        })
        finalImageUrl = uploadRes.url
      } catch (uploadError) {
        console.warn('Cloudinary upload during product creation fell back:', uploadError.message)
      }
    }

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      description: description.trim(),
      image: finalImageUrl,
      availableQty: availableQty !== undefined ? Number(availableQty) : 5,
      locality: locality?.trim() || req.user.locality || 'Indiranagar, Bengaluru',
      distanceKm: 0.8,
      seller: req.user._id,
      sellerName: req.user.name,
      sellerType: req.user.role || 'Balcony Gardener',
      pickupAvailable: pickupAvailable !== undefined ? pickupAvailable : true,
      sellerDelivery: sellerDelivery !== undefined ? sellerDelivery : true,
      tag: tag || 'Freshly Listed',
    })

    res.status(201).json({
      success: true,
      product,
      message: 'Product listed successfully on the community marketplace',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner or Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    // Check ownership
    const isOwner = product.seller && product.seller.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'Admin'

    if (!isOwner && !isAdmin) {
      res.status(403)
      throw new Error('You do not have permission to delete this listing')
    }

    await product.deleteOne()

    res.json({
      success: true,
      message: 'Product listing removed',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
}
