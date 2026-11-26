const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI

    if (!mongoUri) {
      console.error('❌ MongoDB Error: MONGO_URI is missing in Backend/.env')
      return false
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'greenroots',
      serverSelectionTimeoutMS: 8000,
    })

    console.log(`✅ MongoDB Atlas Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`)
    return true
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    if (error.message.includes('SSL alert number 80') || error.message.includes('tlsv1 alert internal error')) {
      console.warn(`
👉 TIP: MongoDB Atlas rejected the TLS handshake (SSL alert 80).
   This happens when your current IP address is not whitelisted in MongoDB Atlas.
   Go to: MongoDB Atlas Dashboard -> Security -> Network Access -> Add IP Address -> Add Current IP or Allow Access from Anywhere (0.0.0.0/0).
`)
    }
    return false
  }
}

module.exports = connectDB
