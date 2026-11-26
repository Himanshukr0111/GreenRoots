const multer = require('multer')

// Store files in memory buffer so they can be streamed directly to Cloudinary
const storage = multer.memoryStorage()

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/gif',
  'image/avif',
]

// File filter for validating image type
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF image formats are allowed.'), false)
  }
}

// 5 MB maximum file size limit
const MAX_FILE_SIZE = 5 * 1024 * 1024

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
})

// Single image upload wrapper with error handling
const uploadSingleImage = (fieldName = 'image') => {
  const uploadHandler = upload.single(fieldName)

  return (req, res, next) => {
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'File size too large. Maximum allowed image size is 5MB.',
          })
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` })
      } else if (err) {
        return res.status(400).json({ error: err.message })
      }
      next()
    })
  }
}

module.exports = {
  upload,
  uploadSingleImage,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
}
