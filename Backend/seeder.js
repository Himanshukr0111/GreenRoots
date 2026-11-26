require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const User = require('./models/User')
const Category = require('./models/Category')
const Product = require('./models/Product')
const Order = require('./models/Order')

const photo = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

const CATEGORIES_DATA = [
  {
    slug: 'indoor-plants',
    name: 'Small & Indoor Plants',
    subtitle: 'Tulsi, Money Plant, Aloe Vera, Snake Plant',
    image: photo('photo-1501004318641-b39e6451bec6'),
    popularIn: 'Balconies & Window Sills',
  },
  {
    slug: 'flowering-plants',
    name: 'Flowering Plants',
    subtitle: 'Hibiscus, Desi Rose, Marigold, Bougainvillea',
    image: photo('photo-1490750967868-88aa4486c946'),
    popularIn: 'Sunny Balconies',
  },
  {
    slug: 'fruit-plants',
    name: 'Fruit & Hybrid Plants',
    subtitle: 'Guava, Lemon, Mango, Pomegranate',
    image: photo('photo-1591857177580-dc82b9ac4e1e'),
    popularIn: 'Terrace & Rooftops',
  },
  {
    slug: 'manure-compost',
    name: 'Organic Manure & Compost',
    subtitle: 'Vermicompost, Gobar Khaad, Cocopeat',
    image: photo('photo-1589923188900-85dae523342b'),
    popularIn: 'Soil Health',
  },
  {
    slug: 'pots-planters',
    name: 'Pots & Planters',
    subtitle: 'Terracotta Gamlas, Clay Pots, Grow Bags',
    image: photo('photo-1485955900006-10f4d324d411'),
    popularIn: 'Home & Balcony',
  },
  {
    slug: 'seeds-saplings',
    name: 'Seeds & Saplings',
    subtitle: 'Vegetable Seeds, Flower Seeds, Herb Starters',
    image: photo('photo-1500382017468-9049fed747ef'),
    popularIn: 'Kitchen Gardens',
  },
  {
    slug: 'gardening-accessories',
    name: 'Gardening Accessories',
    subtitle: 'Khurpi, Pruners, Plant Ties, Trowels',
    image: photo('photo-1416879595882-3373a0480b5b'),
    popularIn: 'Garden Maintenance',
  },
  {
    slug: 'watering-equipment',
    name: 'Watering Equipment',
    subtitle: 'Watering Cans, Spray Bottles, Pipes',
    image: photo('photo-1585320806297-9794b3e4eeae'),
    popularIn: 'Daily Care',
  },
]

const PRODUCTS_DATA = [
  {
    name: 'Krishna Tulsi (Holy Basil)',
    category: 'Small & Indoor Plants',
    price: 40,
    availableQty: 15,
    sellerName: 'Sunita Sharma',
    sellerType: 'Balcony Gardener',
    locality: 'Indiranagar, Bengaluru',
    distanceKm: 1.2,
    pickupAvailable: true,
    sellerDelivery: true,
    tag: 'Sacred & Medicinal',
    image: photo('photo-1501004318641-b39e6451bec6', 700),
    description: 'Home-grown healthy Krishna Tulsi saplings in red garden soil and vermicompost. Very fragrant and pest-resistant.',
  },
  {
    name: 'Golden Money Plant (Pothos)',
    category: 'Small & Indoor Plants',
    price: 80,
    availableQty: 8,
    sellerName: 'Rajesh Patel',
    sellerType: 'Terrace Grower',
    locality: 'Koramangala, Bengaluru',
    distanceKm: 2.4,
    pickupAvailable: true,
    sellerDelivery: false,
    tag: 'Low Maintenance',
    image: photo('photo-1497250681960-ef046c08a56e', 700),
    description: 'Established trailing money plant cuttings in small nursery pots. Thrives in bright indirect light.',
  },
  {
    name: 'Red Desi Hibiscus (Gudhal)',
    category: 'Flowering Plants',
    price: 70,
    availableQty: 6,
    sellerName: 'Ananya Rao',
    sellerType: 'Home Gardener',
    locality: 'HSR Layout, Bengaluru',
    distanceKm: 3.1,
    pickupAvailable: true,
    sellerDelivery: true,
    tag: 'Daily Puja Flowers',
    image: photo('photo-1490750967868-88aa4486c946', 700),
    description: 'Heavy flowering desi red hibiscus bush. Rooted cutting ready for 10-inch gamla or ground planting.',
  },
  {
    name: 'Kagzi Lemon (Nimbu) Plant',
    category: 'Fruit & Hybrid Plants',
    price: 100,
    availableQty: 10,
    sellerName: 'Green Leaf Local Nursery',
    sellerType: 'Neighborhood Nursery',
    locality: 'Jayanagar, Bengaluru',
    distanceKm: 4.5,
    pickupAvailable: true,
    sellerDelivery: true,
    tag: 'High Yield Grafted',
    image: photo('photo-1501004318641-b39e6451bec6', 700),
    description: 'Grafted Kagzi lemon sapling in nursery bag. Thin skin, juicy variety ideal for rooftop terrace drums.',
  },
  {
    name: 'Organic Vermicompost (Kechua Khaad)',
    category: 'Organic Manure & Compost',
    price: 80,
    availableQty: 25,
    sellerName: 'Manoj Kumar',
    sellerType: 'Urban Composter',
    locality: 'Whitefield, Bengaluru',
    distanceKm: 5.2,
    pickupAvailable: true,
    sellerDelivery: true,
    tag: '2 kg Sealed Bag',
    image: photo('photo-1589923188900-85dae523342b', 700),
    description: '100% pure worm castings decomposed from vegetable waste and gobar. Odourless and nutrient-dense.',
  },
  {
    name: 'Traditional Terracotta Mitti Gamla (8-inch)',
    category: 'Pots & Planters',
    price: 50,
    availableQty: 20,
    sellerName: 'Kumhar Colony Potters',
    sellerType: 'Local Artisan',
    locality: 'Malleswaram, Bengaluru',
    distanceKm: 3.8,
    pickupAvailable: true,
    sellerDelivery: false,
    tag: 'Pure Baked Clay',
    image: photo('photo-1485955900006-10f4d324d411', 700),
    description: 'Hand-thrown porous terracotta pot with bottom drainage hole. Natural cooling for plant roots in summer.',
  },
  {
    name: 'Allahabad Safeda Guava Sapling',
    category: 'Fruit & Hybrid Plants',
    price: 120,
    availableQty: 5,
    sellerName: 'Sanjay Deshmukh',
    sellerType: 'Rooftop Orchardist',
    locality: 'JP Nagar, Bengaluru',
    distanceKm: 2.9,
    pickupAvailable: true,
    sellerDelivery: true,
    tag: 'Sweet Amrood',
    image: photo('photo-1591857177580-dc82b9ac4e1e', 700),
    description: 'Vigorous guava sapling grafted for high yield. Can easily be trained in a 40–50 litre terrace drum container.',
  },
  {
    name: 'Aloe Vera (Medicinal Gel Plant)',
    category: 'Small & Indoor Plants',
    price: 60,
    availableQty: 12,
    sellerName: 'Priya Nambiar',
    sellerType: 'Balcony Gardener',
    locality: 'Bellandur, Bengaluru',
    distanceKm: 1.8,
    pickupAvailable: true,
    sellerDelivery: true,
    tag: 'Medicinal & Hardy',
    image: photo('photo-1596547609652-9cf5d8d76921', 700),
    description: 'Mature aloe vera pup with thick, gel-filled fleshy leaves. Requires very little water and purifies indoor air.',
  },
  {
    name: 'Fragrant Desi Red Rose (Indian Gulab)',
    category: 'Flowering Plants',
    price: 60,
    availableQty: 8,
    sellerName: 'Gita Devi',
    sellerType: 'Terrace Gardener',
    locality: 'Basavanagudi, Bengaluru',
    distanceKm: 3.5,
    pickupAvailable: true,
    sellerDelivery: true,
    tag: 'Fragrant Desi',
    image: photo('photo-1494972308805-463bc619d34e', 700),
    description: 'Classic Indian fragrant red rose bush grown with organic cow dung manure. Deep crimson blooms.',
  },
  {
    name: 'Golden Orange Marigold (Genda)',
    category: 'Flowering Plants',
    price: 35,
    availableQty: 18,
    sellerName: 'Lakshmi Nursery',
    sellerType: 'Local Nursery',
    locality: 'BTM Layout, Bengaluru',
    distanceKm: 2.1,
    pickupAvailable: true,
    sellerDelivery: false,
    tag: 'Pollinator Magnet',
    image: photo('photo-1497250681960-ef046c08a56e', 700),
    description: 'Compact blooming marigold in nursery polybag. Deters garden pests and yields cheerful bright flowers.',
  },
]

const seedDatabase = async () => {
  try {
    const isConnected = await connectDB()
    if (!isConnected) {
      console.error('Cannot seed: Database connection failed.')
      process.exit(1)
    }

    // If destroying data
    if (process.argv[2] === '-d') {
      console.log('Clearing existing collections in MongoDB Atlas...')
      await Category.deleteMany()
      await Product.deleteMany()
      await Order.deleteMany()
      console.log('✅ Collections cleared cleanly.')
      await mongoose.disconnect()
      process.exit(0)
    }

    console.log('Seeding GreenRoots initial database to MongoDB Atlas...')

    // 1. Clear old seed data
    await Category.deleteMany()
    await Product.deleteMany()

    // 2. Insert or find demo seller users
    let demoUser = await User.findOne({ email: 'priya@greenroots.in' })
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Priya Sharma',
        email: 'priya@greenroots.in',
        password: 'password123',
        role: 'Balcony Gardener',
        locality: 'Indiranagar, Bengaluru',
      })
      console.log('✅ Created Demo User:', demoUser.email)
    }

    // 3. Insert Categories
    const insertedCategories = await Category.insertMany(CATEGORIES_DATA)
    console.log(`✅ Seeded ${insertedCategories.length} Categories`)

    // 4. Attach demoUser as default seller and insert Products
    const productsWithSeller = PRODUCTS_DATA.map((prod) => ({
      ...prod,
      seller: demoUser._id,
    }))

    const insertedProducts = await Product.insertMany(productsWithSeller)
    console.log(`✅ Seeded ${insertedProducts.length} Marketplace Products`)

    console.log('🎉 Seeding successfully completed!')
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`)
    process.exit(1)
  }
}

seedDatabase()
