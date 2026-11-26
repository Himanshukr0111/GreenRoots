const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const connectDB = require('./config/db')

// Route handlers
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const orderRoutes = require('./routes/orderRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const plantRoutes = require('./routes/plantRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// Load environment variables from .env
dotenv.config()

const app = express()

// Connect to MongoDB Atlas
connectDB()

// Global Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'GreenRoots API',
    description: 'Indian Hyperlocal Gardening Marketplace Backend',
    version: '1.0.0',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? `Connected (${mongoose.connection.name})` : 'Connecting/Disconnected',
  })
})

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbName: mongoose.connection.name || 'greenroots',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/identify-plant', plantRoutes)
app.use('/api/plant', plantRoutes)

// 404 & Centralized Error Middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`🌿 GreenRoots Backend Server running on port ${PORT}`)
})

module.exports = { app, server }
