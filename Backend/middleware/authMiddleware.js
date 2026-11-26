const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes - requires valid JWT token
const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'greenroots_default_jwt_secret_dev'
      )

      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ error: 'User no longer exists' })
      }

      next()
    } catch (error) {
      console.error('JWT Verification Error:', error.message)
      return res.status(401).json({ error: 'Not authorized, token invalid or expired' })
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' })
  }
}

// Optional Auth middleware - attaches user if token exists, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'greenroots_default_jwt_secret_dev'
      )
      req.user = await User.findById(decoded.id).select('-password')
    } catch {
      // Ignore token error for optional auth
    }
  }
  next()
}

module.exports = { protect, optionalAuth }
