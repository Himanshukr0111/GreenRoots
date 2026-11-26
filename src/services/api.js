/**
 * Centralized GreenRoots Frontend API Client
 * Manages JWT tokens and communicates with the Express backend at /api
 */

const TOKEN_KEY = 'greenroots_jwt_token_v1'

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (e) {
    console.warn('Could not save JWT token:', e)
  }
}

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (e) {
    console.warn('Could not remove JWT token:', e)
  }
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const config = {
    ...options,
    headers,
  }

  const response = await fetch(endpoint, config)
  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `HTTP ${response.status} Request failed`
    const error = new Error(errorMsg)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  // Authentication
  auth: {
    register: (userData) =>
      request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    login: (credentials) =>
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    getMe: () => request('/api/auth/me'),
  },

  // Products
  products: {
    getProducts: (params = {}) => {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val)
        }
      })
      const queryString = query.toString() ? `?${query.toString()}` : ''
      return request(`/api/products${queryString}`)
    },
    getProductById: (id) => request(`/api/products/${id}`),
    createProduct: (productData) =>
      request('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),
    deleteProduct: (id) =>
      request(`/api/products/${id}`, {
        method: 'DELETE',
      }),
  },

  // Image Upload (Cloudinary)
  upload: {
    getStatus: () => request('/api/upload/status'),
    uploadImage: (imageFileOrBase64) => {
      if (typeof window !== 'undefined' && imageFileOrBase64 instanceof FormData) {
        const token = getToken()
        return fetch('/api/upload', {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: imageFileOrBase64,
        }).then(async (res) => {
          const data = await res.json().catch(() => null)
          if (!res.ok) {
            throw new Error(data?.error || `Upload failed with status ${res.status}`)
          }
          return data
        })
      }

      return request('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ image: imageFileOrBase64 }),
      })
    },
  },

  // Categories
  categories: {
    getCategories: () => request('/api/categories'),
  },

  // Orders
  orders: {
    createOrder: (orderData) =>
      request('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    getMyOrders: () => request('/api/orders/my-orders'),
  },

  // AI Plant Advisor
  plantAdvisor: {
    getStatus: () => request('/api/identify-plant/status'),
    identify: (imageData, mimeType) =>
      request('/api/identify-plant', {
        method: 'POST',
        body: JSON.stringify({ image: imageData, mimeType }),
      }),
  },
}

export default api
