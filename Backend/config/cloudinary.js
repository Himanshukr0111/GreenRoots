const cloudinary = require('cloudinary').v2

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
})

/**
 * Check whether Cloudinary credentials have been provided
 */
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
  )
}

/**
 * Upload an image (Base64 data URI, file buffer, or URL) to Cloudinary
 * @param {Buffer|string} fileSource - Buffer, Base64 data URI, or URL
 * @param {Object} customOptions - Optional Cloudinary upload options
 * @returns {Promise<{url: string, public_id: string, format: string}>}
 */
const uploadToCloudinary = (fileSource, customOptions = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your Backend .env file.'))
    }

    const defaultOptions = {
      folder: 'greenroots/products',
      resource_type: 'image',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'avif'],
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
      ...customOptions,
    }

    // If fileSource is a Buffer, use upload_stream
    if (Buffer.isBuffer(fileSource)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        defaultOptions,
        (error, result) => {
          if (error) return reject(error)
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          })
        }
      )
      uploadStream.end(fileSource)
    } else if (typeof fileSource === 'string') {
      // If string (Base64 data URI or remote URL)
      cloudinary.uploader.upload(fileSource, defaultOptions)
        .then((result) => {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          })
        })
        .catch(reject)
    } else {
      reject(new Error('Invalid file source format for Cloudinary upload'))
    }
  })
}

/**
 * Delete an image asset from Cloudinary
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured() || !publicId) return null
  try {
    return await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.warn(`Could not delete Cloudinary asset ${publicId}:`, err.message)
    return null
  }
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
}
