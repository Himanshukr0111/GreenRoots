import { useState } from 'react'
import { MapPin, Heart, MessageCircle, PackageCheck, Bike, AlertCircle, ArrowRight, ShoppingBag, Check, Trash2, X } from 'lucide-react'
import { formatINR } from '../utils/formatters'
import { useMarketplace } from '../context/useMarketplace'
import { IMAGES } from '../utils/imageRegistry'

export default function NeighbourhoodListings() {
  const [activeTab, setActiveTab] = useState('all')
  const {
    listings,
    isInWishlist,
    toggleWishlist,
    addToCart,
    selectedCategory,
    setSelectedCategory,
    deleteListing,
    user,
  } = useMarketplace()
  const [addedItems, setAddedItems] = useState({})

  const handleAddToCart = (item) => {
    const itemId = item._id || item.id
    addToCart(item, 1)
    setAddedItems((prev) => ({ ...prev, [itemId]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [itemId]: false }))
    }, 1500)
  }

  let filteredListings = listings

  if (selectedCategory && selectedCategory !== 'All') {
    filteredListings = filteredListings.filter((item) => item.category === selectedCategory)
  }

  if (activeTab === 'plants') {
    filteredListings = filteredListings.filter((item) => item.category?.includes('Plants'))
  } else if (activeTab === 'supplies') {
    filteredListings = filteredListings.filter((item) => !item.category?.includes('Plants'))
  }

  return (
    <section id="neighbourhood" className="section-padding neighbourhood-section">
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <div className="section-badge">Hyperlocal Peer-to-Peer Market</div>
            <h2 className="section-title">Growing in Your Neighbourhood</h2>
            <p className="section-desc">
              Direct listings from local balcony gardeners, rooftop growers, and nearby nurseries. Pick up in person or arrange local drop-off.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="tab-pill-group">
            <button
              type="button"
              className={`tab-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Listings ({listings.length})
            </button>
            <button
              type="button"
              className={`tab-pill ${activeTab === 'plants' ? 'active' : ''}`}
              onClick={() => setActiveTab('plants')}
            >
              Plants &amp; Saplings
            </button>
            <button
              type="button"
              className={`tab-pill ${activeTab === 'supplies' ? 'active' : ''}`}
              onClick={() => setActiveTab('supplies')}
            >
              Manure, Pots &amp; Soil
            </button>
          </div>
        </div>

        {/* Development Data Transparency Banner */}
        <div className="dev-notice-banner">
          <AlertCircle size={15} className="notice-icon" />
          <span>
            <strong>Hyperlocal Community Market:</strong> Live peer-to-peer listings powered by MongoDB Atlas. Local growers set their own prices with direct neighbourhood handoff.
          </span>
        </div>

        {/* Active Category Filter Badge */}
        {selectedCategory && selectedCategory !== 'All' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', background: '#e8f5e9', border: '1px solid #c8e6c9', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', width: 'fit-content' }}>
            <span>Filtered by category: <strong>{selectedCategory}</strong></span>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--color-primary)', fontWeight: 600 }}
              title="Clear category filter"
            >
              <X size={14} /> Clear Filter
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="listings-grid">
          {filteredListings.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '3rem 1rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>No listings found matching the selected category.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSelectedCategory('All')}
              >
                View All Listings
              </button>
            </div>
          ) : (
            filteredListings.map((item) => {
              const itemId = item._id || item.id
              const saved = isInWishlist(itemId)
              const isAdded = addedItems[itemId]
              const isOwner = user && (
                item.seller?._id === user._id ||
                item.seller === user._id ||
                item.sellerName === user.name
              )

              return (
                <article key={itemId} className="listing-card">
                  {/* Product Media */}
                  <div className="listing-image-container">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = IMAGES.products.tulsi
                      }}
                    />
                    <span className="listing-tag">{item.tag || 'Community'}</span>
                    <span className="listing-distance">
                      <MapPin size={11} /> {item.distanceKm || 1.5} km away
                    </span>
                    <button
                      type="button"
                      className={`listing-wishlist-btn ${saved ? 'active' : ''}`}
                      onClick={() => toggleWishlist(itemId)}
                      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                      title={saved ? 'Remove from saved' : 'Save to wishlist'}
                    >
                      <Heart
                        size={16}
                        fill={saved ? 'currentColor' : 'none'}
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="listing-content">
                    {/* Seller & Locality */}
                    <div className="listing-seller-meta">
                      <span className="listing-seller-name">{item.sellerName}</span>
                      <span className="listing-seller-badge">{item.sellerType}</span>
                    </div>
                    <div className="listing-locality">
                      <MapPin size={12} />
                      <span>{item.locality}</span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="listing-title">{item.name}</h3>
                    <p className="listing-desc">{item.description}</p>

                    {/* Fulfilment Badges */}
                    <div className="listing-fulfilment-row">
                      {item.pickupAvailable && (
                        <span className="fulfilment-badge pickup" title="Buyer can collect in person">
                          <PackageCheck size={12} /> Local Pickup
                        </span>
                      )}
                      {item.sellerDelivery && (
                        <span className="fulfilment-badge delivery" title="Seller can deliver locally">
                          <Bike size={12} /> Seller Delivery
                        </span>
                      )}
                    </div>

                    {/* Owner Management Controls */}
                    {isOwner && (
                      <div style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete listing "${item.name}" from MongoDB?`)) {
                              deleteListing(itemId)
                            }
                          }}
                          style={{
                            background: '#fef2f2',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                          title="Delete your listing"
                        >
                          <Trash2 size={12} />
                          <span>Delete Your Listing</span>
                        </button>
                      </div>
                    )}

                    {/* Pricing & Cart Action */}
                    <div className="listing-footer">
                      <div>
                        <div className="listing-price">{formatINR(item.price)}</div>
                        <div className="listing-stock">{item.availableQty || 5} available</div>
                      </div>

                      <div className="listing-actions-row">
                        <button
                          type="button"
                          className={`btn-add-cart-listing ${isAdded ? 'added' : ''}`}
                          onClick={() => handleAddToCart(item)}
                          title="Add to shopping cart"
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="btn-contact-seller"
                          title="Inquire directly with seller"
                          onClick={() => handleAddToCart(item)}
                        >
                          <MessageCircle size={14} />
                          <span>Inquire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>

        {/* View All Action */}
        <div className="section-cta-wrap">
          <a href="#neighbourhood" className="btn-view-all">
            <span>Explore All Local Listings</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}
