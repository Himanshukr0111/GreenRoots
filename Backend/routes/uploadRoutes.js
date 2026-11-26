const express = require('express')
const router = express.Router()
const { uploadSingleImage } = require('../middleware/uploadMiddleware')
const {
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
} = require('../config/cloudinary')
const { optionalAuth, protect } = require('../middleware/authMiddleware')

// @desc    Check Cloudinary configuration status
// @route   GET /api/upload/status
// @access  Public
router.get('/status', (req, res) => {
  const configured = isCloudinaryConfigured()
  res.json({
    success: true,
    configured,
    cloudName: configured ? process.env.CLOUDINARY_CLOUD_NAME : null,
    message: configured
      ? 'Cloudinary image storage is configured and ready'
      : 'Cloudinary credentials pending in Backend .env file',
  })
})

// @desc    Upload product image to Cloudinary (Multipart or Base64)
// @route   POST /api/upload
// @access  Public / Optional Auth (Guest or Registered Seller)
router.post('/', optionalAuth, uploadSingleImage('image'), async (req, res, next) => {
  try {
    // 1. Check if multipart file buffer is provided
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return res.status(503).json({
          error: 'Cloudinary credentials not configured in Backend .env. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
          configured: false,
        })
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'greenroots/products',
      })

      return res.status(200).json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        format: result.format,
        message: 'Image successfully uploaded to Cloudinary',
      })
    }

    // 2. Check if Base64 data URI is provided in JSON body
    const { image } = req.body
    if (image && typeof image === 'string') {
      if (!image.startsWith('data:image/') && !image.startsWith('http://') && !image.startsWith('https://')) {
        return res.status(400).json({
          error: 'Invalid image format. Expected a multipart file or Base64 data URI (data:image/...).',
        })
      }

      // Check Base64 payload size (< 6MB string)
      if (image.length > 7 * 1024 * 1024) {
        return res.status(400).json({
          error: 'Image data is too large. Maximum allowed size is 5MB.',
        })
      }

      // If already a remote URL, return it
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return res.status(200).json({
          success: true,
          url: image,
          message: 'Remote image URL verified',
        })
      }

      // Base64 upload to Cloudinary
      if (!isCloudinaryConfigured()) {
        return res.status(503).json({
          error: 'Cloudinary credentials not configured in Backend .env. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
          configured: false,
        })
      }

      const result = await uploadToCloudinary(image, {
        folder: 'greenroots/products',
      })

      return res.status(200).json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        format: result.format,
        message: 'Image successfully uploaded to Cloudinary',
      })
    }

    return res.status(400).json({
      error: 'Please provide an image file or Base64 data URI in the request.',
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload
// @access  Private (Owner/Admin)
router.delete('/', protect, async (req, res, next) => {
  try {
    const { public_id } = req.body
    if (!public_id) {
      return res.status(400).json({ error: 'Please provide the public_id of the image to delete' })
    }

    await deleteFromCloudinary(public_id)
    res.json({
      success: true,
      message: 'Cloudinary asset removed',
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
