const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, locality } = req.body

    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Please provide name, email, and password')
    }

    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
      res.status(400)
      throw new Error('Invalid input format')
    }

    if (password.length < 6) {
      res.status(400)
      throw new Error('Password must be at least 6 characters')
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() })
    if (userExists) {
      res.status(400)
      throw new Error('An account with this email address already exists')
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'Balcony Gardener',
      locality: locality?.trim() || 'Indiranagar, Bengaluru',
    })

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        locality: user.locality,
      },
      token: generateToken(user._id),
      message: 'Account created successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400)
      throw new Error('Please provide an email and password')
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400)
      throw new Error('Invalid email or password format')
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          locality: user.locality,
        },
        token: generateToken(user._id),
        message: 'Logged in successfully',
      })
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      locality: req.user.locality,
      createdAt: req.user.createdAt,
    },
  })
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
}
