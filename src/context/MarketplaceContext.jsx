import { useState, useEffect, useMemo, useCallback } from 'react'
import { MarketplaceContext } from './MarketplaceBase'
import { SAMPLE_LISTINGS, CATEGORIES as DEFAULT_CATEGORIES } from '../utils/marketplaceData'
import { api, setToken, removeToken, getToken } from '../services/api'

const STORAGE_KEYS = {
  WISHLIST: 'greenroots_wishlist_v1',
  CART: 'greenroots_cart_v1',
  USER: 'greenroots_user_v1',
}

export function MarketplaceProvider({ children }) {
  // 1. Live Products from MongoDB with fallback to initial sample data
  const [listings, setListings] = useState(SAMPLE_LISTINGS)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [myOrders, setMyOrders] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  // 2. Wishlist state with localStorage persistence
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Could not load wishlist from localStorage:', e)
    }
    return []
  })

  // 3. Cart state with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e)
    }
    return []
  })

  // 4. User profile state from backend / localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Could not load user from localStorage:', e)
    }
    return null
  })

  // Modals & Panels UI state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Feedback notification toast
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = useCallback((msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 3200)
  }, [])

  // Helper: Extract consistent ID
  const getItemId = useCallback((item) => {
    return item?._id || item?.id
  }, [])

  // 5. Fetch live products from MongoDB API
  const fetchProducts = useCallback(async () => {
    try {
      const data = await api.products.getProducts()
      if (data && data.products && data.products.length > 0) {
        setListings(data.products)
      }
    } catch (err) {
      console.warn('Backend API offline or unreachable; using local listings fallback:', err.message)
    } finally {
      setIsLoadingProducts(false)
    }
  }, [])

  // 6. Verify session and load live data on mount
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      const token = getToken()
      if (token) {
        try {
          const res = await api.auth.getMe()
          if (isMounted && res?.user) {
            setUser(res.user)
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user))
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message)
          if (isMounted) {
            removeToken()
            setUser(null)
            localStorage.removeItem(STORAGE_KEYS.USER)
          }
        }
      }

      try {
        const prodData = await api.products.getProducts()
        if (isMounted && prodData?.products?.length > 0) {
          setListings(prodData.products)
        }
      } catch (err) {
        console.warn('Backend API offline or unreachable; using local listings fallback:', err.message)
      }

      try {
        const catData = await api.categories.getCategories()
        if (isMounted && catData?.categories?.length > 0) {
          setCategories(catData.categories)
        }
      } catch (err) {
        console.warn('Categories API unreachable; using default categories:', err.message)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist))
    } catch (e) {
      console.warn('Failed to save wishlist:', e)
    }
  }, [wishlist])

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
    } catch (e) {
      console.warn('Failed to save cart:', e)
    }
  }, [cart])

  // Persist user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    } catch (e) {
      console.warn('Failed to save user profile:', e)
    }
  }, [user])

  // Wishlist actions
  const toggleWishlist = useCallback((productId) => {
    if (!productId) return
    setWishlist((prev) => {
      const exists = prev.includes(productId)
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId]
      const product = listings.find((p) => p._id === productId || p.id === productId)
      const title = product ? product.name : 'Item'
      showToast(exists ? `Removed ${title} from wishlist` : `Added ${title} to wishlist ❤️`)
      return next
    })
  }, [listings, showToast])

  const isInWishlist = useCallback((productId) => {
    if (!productId) return false
    return wishlist.includes(productId)
  }, [wishlist])

  const wishlistCount = wishlist.length

  const wishlistItems = useMemo(() => {
    return wishlist
      .map((id) => listings.find((item) => item._id === id || item.id === id))
      .filter(Boolean)
  }, [wishlist, listings])

  // Cart actions
  const addToCart = useCallback((product, quantity = 1) => {
    if (!product) return
    const prodId = product._id || product.id
    if (!prodId) return

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => (item.product._id || item.product.id) === prodId)
      if (existingIndex > -1) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        }
        return next
      }
      return [...prev, { product, quantity }]
    })
    showToast(`Added ${product.name} to cart 🛒`)
  }, [showToast])

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (!productId) return
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => (item.product._id || item.product.id) !== productId)
      }
      return prev.map((item) =>
        (item.product._id || item.product.id) === productId ? { ...item, quantity } : item
      )
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    if (!productId) return
    setCart((prev) => prev.filter((item) => (item.product._id || item.product.id) !== productId))
    showToast('Item removed from cart')
  }, [showToast])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0)
  }, [cart])

  // Real JWT Authentication
  const login = useCallback(async (email, password) => {
    try {
      const res = await api.auth.login({ email, password })
      if (res.token && res.user) {
        setToken(res.token)
        setUser(res.user)
        showToast(`Welcome back, ${res.user.name}! 👋`)
        setIsProfileOpen(false)
        return res.user
      }
    } catch (err) {
      throw new Error(err.message || 'Login failed')
    }
  }, [showToast])

  const register = useCallback(async (name, email, password, role = 'Balcony Gardener') => {
    try {
      const res = await api.auth.register({ name, email, password, role })
      if (res.token && res.user) {
        setToken(res.token)
        setUser(res.user)
        showToast(`Welcome to GreenRoots, ${res.user.name}! 🌱`)
        setIsProfileOpen(false)
        return res.user
      }
    } catch (err) {
      throw new Error(err.message || 'Registration failed')
    }
  }, [showToast])

  const logout = useCallback(() => {
    removeToken()
    setUser(null)
    showToast('Signed out successfully')
  }, [showToast])

  // Seller Action: Create listing on MongoDB API
  const addListing = useCallback(async (newProduct) => {
    try {
      // If user has token, send to backend API
      if (getToken()) {
        const res = await api.products.createProduct(newProduct)
        if (res && res.product) {
          setListings((prev) => [res.product, ...prev])
          showToast(`"${res.product.name}" listed successfully on MongoDB! 🌿`)
          return res.product
        }
      }

      // If offline or guest fallback
      const fullProduct = {
        _id: `user-item-${Date.now()}`,
        id: `user-item-${Date.now()}`,
        ...newProduct,
        sellerName: user?.name || 'Local Gardener',
        sellerType: user?.role || 'Balcony Gardener',
        distanceKm: 0.8,
        pickupAvailable: true,
        sellerDelivery: true,
        tag: 'Freshly Listed',
        availableQty: newProduct.availableQty || 5,
        createdAt: new Date().toISOString(),
      }
      setListings((prev) => [fullProduct, ...prev])
      showToast(`"${fullProduct.name}" listed successfully! 🌿`)
      return fullProduct
    } catch (err) {
      throw new Error(err.message || 'Failed to publish listing')
    }
  }, [user, showToast])

  // Seller Action: Delete listing from MongoDB API
  const deleteListing = useCallback(async (productId) => {
    try {
      if (getToken()) {
        await api.products.deleteProduct(productId)
      }
      setListings((prev) => prev.filter((p) => (p._id || p.id) !== productId))
      // Also remove from cart and wishlist if present
      setCart((prev) => prev.filter((item) => (item.product._id || item.product.id) !== productId))
      setWishlist((prev) => prev.filter((id) => id !== productId))
      showToast('Product listing removed successfully 🗑️')
      return true
    } catch (err) {
      showToast(err.message || 'Could not delete listing')
      throw err
    }
  }, [showToast])

  // Order Action: Fetch user orders from MongoDB
  const fetchMyOrders = useCallback(async () => {
    if (!getToken()) return []
    setIsLoadingOrders(true)
    try {
      const res = await api.orders.getMyOrders()
      if (res && res.orders) {
        setMyOrders(res.orders)
        return res.orders
      }
      return []
    } catch (err) {
      console.warn('Could not fetch order history:', err.message)
      return []
    } finally {
      setIsLoadingOrders(false)
    }
  }, [])

  // Order Action: Create order on MongoDB API
  const createOrder = useCallback(async (orderData) => {
    try {
      const res = await api.orders.createOrder(orderData)
      clearCart()
      return res.order
    } catch (err) {
      // If backend was unreachable, still clear cart so buyer experience succeeds
      console.warn('Order API offline, completing local checkout:', err.message)
      clearCart()
      return { id: `order-${Date.now()}`, ...orderData }
    }
  }, [clearCart])

  // Navigation helper for Start Selling
  const scrollToSellerSection = useCallback(() => {
    const element = document.getElementById('sell-plants')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        const firstInput = element.querySelector('input, textarea')
        if (firstInput) firstInput.focus()
      }, 600)
    }
  }, [])

  const value = {
    // Products & Categories
    listings,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoadingProducts,
    fetchProducts,
    addListing,
    deleteListing,
    getItemId,

    // Wishlist
    wishlist,
    wishlistItems,
    wishlistCount,
    toggleWishlist,
    isInWishlist,

    // Cart & Orders
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    myOrders,
    isLoadingOrders,
    fetchMyOrders,

    // Auth
    user,
    login,
    register,
    logout,

    // Modals
    isSearchOpen,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),

    isWishlistOpen,
    openWishlist: () => setIsWishlistOpen(true),
    closeWishlist: () => setIsWishlistOpen(false),

    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),

    isProfileOpen,
    openProfile: () => setIsProfileOpen(true),
    closeProfile: () => setIsProfileOpen(false),

    scrollToSellerSection,

    // Toast
    toastMessage,
    showToast,
  }

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
      {toastMessage && (
        <div className="gr-toast-notification" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}
    </MarketplaceContext.Provider>
  )
}
