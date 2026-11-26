import { useState, useEffect, useCallback } from 'react'
import { X, User, Mail, Lock, Sprout, LogOut, ArrowRight, ShieldCheck, Heart, ShoppingBag, PlusCircle, Loader2, Package, Trash2, Calendar } from 'lucide-react'
import { useMarketplace } from '../context/useMarketplace'
import { formatINR } from '../utils/formatters'
import { IMAGES } from '../utils/imageRegistry'

export default function ProfileModal() {
  const {
    isProfileOpen,
    closeProfile,
    user,
    login,
    register,
    logout,
    wishlistCount,
    cartCount,
    scrollToSellerSection,
    listings,
    deleteListing,
    myOrders,
    isLoadingOrders,
    fetchMyOrders,
  } = useMarketplace()

  const [activeTab, setActiveTab] = useState('login') // 'login' | 'register'
  const [profileViewTab, setProfileViewTab] = useState('overview') // 'overview' | 'orders' | 'listings'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Balcony Gardener')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = useCallback(() => {
    setError('')
    setIsLoading(false)
    closeProfile()
  }, [closeProfile])

  // Prevent background scroll
  useEffect(() => {
    if (isProfileOpen) {
      document.body.style.overflow = 'hidden'
      if (user) {
        fetchMyOrders()
      }
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isProfileOpen, user, fetchMyOrders])

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isProfileOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isProfileOpen, handleClose])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please provide your email and password')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all required fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await register(name, email, password, role)
      setName('')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoutClick = () => {
    logout()
    setName('')
    setEmail('')
    setPassword('')
    setProfileViewTab('overview')
  }

  // Find user's listings
  const myListings = user
    ? listings.filter(
        (item) =>
          item.seller?._id === user._id ||
          item.seller === user._id ||
          item.sellerName === user.name
      )
    : []

  if (!isProfileOpen) return null

  return (
    <div className="gr-overlay-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-label="Account Settings">
      <div className="gr-profile-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gr-modal-header">
          <div className="gr-profile-brand">
            <span className="brand-logo-text" style={{ fontSize: '1.25rem' }}>GreenRoots</span>
            <span className="brand-tag">COMMUNITY</span>
          </div>
          <button
            type="button"
            className="gr-modal-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="gr-modal-body">
          {user ? (
            /* Logged In View */
            <div className="gr-user-profile-view">
              <div className="gr-avatar-header">
                <div className="gr-avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="gr-avatar-meta">
                  <h3>{user.name}</h3>
                  <span className="gr-user-badge">{user.role}</span>
                  <p className="gr-user-email">{user.email}</p>
                </div>
              </div>

              {/* User Sub-tabs */}
              <div className="gr-tab-header" style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  className={`gr-tab-btn ${profileViewTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setProfileViewTab('overview')}
                >
                  Overview
                </button>
                <button
                  type="button"
                  className={`gr-tab-btn ${profileViewTab === 'orders' ? 'active' : ''}`}
                  onClick={() => {
                    setProfileViewTab('orders')
                    fetchMyOrders()
                  }}
                >
                  My Orders ({myOrders.length})
                </button>
                <button
                  type="button"
                  className={`gr-tab-btn ${profileViewTab === 'listings' ? 'active' : ''}`}
                  onClick={() => setProfileViewTab('listings')}
                >
                  My Listings ({myListings.length})
                </button>
              </div>

              {profileViewTab === 'overview' && (
                <>
                  {/* Quick Stats Grid */}
                  <div className="gr-user-stats-grid">
                    <div className="gr-stat-card">
                      <Heart size={18} className="gr-stat-icon" />
                      <div>
                        <span className="gr-stat-val">{wishlistCount}</span>
                        <span className="gr-stat-label">Saved Plants</span>
                      </div>
                    </div>
                    <div className="gr-stat-card">
                      <ShoppingBag size={18} className="gr-stat-icon" />
                      <div>
                        <span className="gr-stat-val">{cartCount}</span>
                        <span className="gr-stat-label">Cart Items</span>
                      </div>
                    </div>
                  </div>

                  {/* Action shortcuts */}
                  <div className="gr-user-actions-list">
                    <button
                      type="button"
                      className="gr-user-action-item"
                      onClick={() => {
                        handleClose()
                        scrollToSellerSection()
                      }}
                    >
                      <PlusCircle size={18} />
                      <span>List a Plant or Extra Sapling</span>
                      <ArrowRight size={15} style={{ marginLeft: 'auto' }} />
                    </button>
                  </div>

                  <div className="gr-user-locality-banner">
                    <Sprout size={16} />
                    <span>Active in {user.locality || 'Bengaluru Hyperlocal Hub'} &bull; Local pickup enabled</span>
                  </div>
                </>
              )}

              {profileViewTab === 'orders' && (
                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {isLoadingOrders ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                      <Loader2 size={20} className="spin" style={{ margin: '0 auto 0.5rem' }} />
                      <p>Loading your orders...</p>
                    </div>
                  ) : myOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '8px' }}>
                      <Package size={28} style={{ color: '#94a3b8', margin: '0 auto 0.5rem' }} />
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>No orders placed yet.</p>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ marginTop: '0.75rem', fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                        onClick={() => {
                          handleClose()
                          const el = document.getElementById('neighbourhood')
                          if (el) el.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        Browse Community Market
                      </button>
                    </div>
                  ) : (
                    myOrders.map((ord) => (
                      <div
                        key={ord._id}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          background: '#ffffff',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                            #{String(ord._id).slice(-8).toUpperCase()}
                          </span>
                          <span
                            style={{
                              background: ord.status === 'confirmed' ? '#dcfce7' : '#fef9c3',
                              color: ord.status === 'confirmed' ? '#166534' : '#854d0e',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            {ord.status || 'Pending'}
                          </span>
                        </div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={12} />
                          <span>{new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>&bull;</span>
                          <span>{ord.items?.length || 1} {ord.items?.length === 1 ? 'item' : 'items'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.35rem' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Fulfilment: {ord.deliveryType || 'Pickup'}</span>
                          <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatINR(ord.totalAmount)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {profileViewTab === 'listings' && (
                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {myListings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '8px' }}>
                      <Sprout size={28} style={{ color: '#94a3b8', margin: '0 auto 0.5rem' }} />
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>You haven&apos;t listed any plants yet.</p>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ marginTop: '0.75rem', fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                        onClick={() => {
                          handleClose()
                          scrollToSellerSection()
                        }}
                      >
                        List a Plant Now
                      </button>
                    </div>
                  ) : (
                    myListings.map((item) => {
                      const prodId = item._id || item.id
                      return (
                        <div
                          key={prodId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '0.65rem 0.75rem',
                            background: '#ffffff',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = IMAGES.products.tulsi
                              }}
                            />
                            <div>
                              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{item.name}</h4>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>{formatINR(item.price)}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete "${item.name}" from community market?`)) {
                                deleteListing(prodId)
                              }
                            }}
                            style={{
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                            title="Remove listing"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              <button
                type="button"
                className="gr-btn-logout"
                onClick={handleLogoutClick}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Logged Out: Tabs for Login / Register */
            <div>
              <div className="gr-tab-header">
                <button
                  type="button"
                  className={`gr-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('login')
                    setError('')
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`gr-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('register')
                    setError('')
                  }}
                >
                  Create Account
                </button>
              </div>

              {error && <div className="gr-auth-error">{error}</div>}

              {activeTab === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="gr-auth-form">
                  <p className="gr-form-subtext">
                    Sign in to your GreenRoots account to list plants, manage orders, and save your favourite items.
                  </p>

                  <div className="gr-form-group">
                    <label htmlFor="login-email">Email Address</label>
                    <div className="gr-input-icon-wrap">
                      <Mail size={16} className="gr-input-icon" />
                      <input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="gr-form-input"
                      />
                    </div>
                  </div>

                  <div className="gr-form-group">
                    <label htmlFor="login-password">Password</label>
                    <div className="gr-input-icon-wrap">
                      <Lock size={16} className="gr-input-icon" />
                      <input
                        id="login-password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="gr-form-input"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary gr-btn-auth-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to GreenRoots</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="gr-auth-notice">
                    <ShieldCheck size={14} />
                    <span>Protected by JWT &bull; Secure MongoDB Atlas Backend</span>
                  </div>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="gr-auth-form">
                  <p className="gr-form-subtext">
                    Join neighbours exchanging plant cuttings, organic manure, and gardening advice.
                  </p>

                  <div className="gr-form-group">
                    <label htmlFor="reg-name">Full Name</label>
                    <div className="gr-input-icon-wrap">
                      <User size={16} className="gr-input-icon" />
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="gr-form-input"
                      />
                    </div>
                  </div>

                  <div className="gr-form-group">
                    <label htmlFor="reg-email">Email Address</label>
                    <div className="gr-input-icon-wrap">
                      <Mail size={16} className="gr-input-icon" />
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="gr-form-input"
                      />
                    </div>
                  </div>

                  <div className="gr-form-group">
                    <label htmlFor="reg-password">Password</label>
                    <div className="gr-input-icon-wrap">
                      <Lock size={16} className="gr-input-icon" />
                      <input
                        id="reg-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="gr-form-input"
                      />
                    </div>
                  </div>

                  <div className="gr-form-group">
                    <label htmlFor="reg-role">Gardening Interest / Role</label>
                    <select
                      id="reg-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="gr-form-select"
                    >
                      <option value="Balcony Gardener">Balcony Gardener</option>
                      <option value="Terrace Grower">Terrace Grower</option>
                      <option value="Indoor Plant Lover">Indoor Plant Lover</option>
                      <option value="Urban Composter">Urban Composter</option>
                      <option value="Local Nursery Stand">Local Nursery Stand</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary gr-btn-auth-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Free Account</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="gr-auth-notice">
                    <ShieldCheck size={14} />
                    <span>Free community profile &bull; Password securely hashed with bcrypt</span>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
