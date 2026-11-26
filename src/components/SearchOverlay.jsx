import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Search, X, MapPin, Heart, ShoppingBag } from 'lucide-react'
import { useMarketplace } from '../context/useMarketplace'
import { formatINR } from '../utils/formatters'
import { IMAGES } from '../utils/imageRegistry'

export default function SearchOverlay() {
  const {
    isSearchOpen,
    closeSearch,
    listings,
    addToCart,
    isInWishlist,
    toggleWishlist,
  } = useMarketplace()

  const [query, setQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const inputRef = useRef(null)

  const handleClose = useCallback(() => {
    setQuery('')
    setSelectedFilter('All')
    closeSearch()
  }, [closeSearch])

  // Focus input when opened and lock body scroll
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => inputRef.current?.focus(), 80)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isSearchOpen])

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, handleClose])

  // Filter listings based on query and filter pill
  const filteredListings = useMemo(() => {
    let result = listings

    // Query filter
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.sellerName?.toLowerCase().includes(q) ||
          item.locality?.toLowerCase().includes(q)
      )
    }

    // Category / pill filter
    if (selectedFilter === 'Under ₹50') {
      result = result.filter((item) => item.price <= 50)
    } else if (selectedFilter === 'Under ₹100') {
      result = result.filter((item) => item.price <= 100)
    } else if (selectedFilter === 'Plants') {
      result = result.filter((item) => item.category?.includes('Plants'))
    } else if (selectedFilter === 'Manure & Soil') {
      result = result.filter((item) => item.category?.includes('Manure') || item.category?.includes('Soil'))
    } else if (selectedFilter === 'Pots & Planters') {
      result = result.filter((item) => item.category?.includes('Pots'))
    }

    return result
  }, [listings, query, selectedFilter])

  if (!isSearchOpen) return null

  const popularSearches = ['Tulsi', 'Hibiscus', 'Money Plant', 'Vermicompost', 'Gamla', 'Rose']

  return (
    <div className="gr-overlay-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-label="Search Marketplace">
      <div className="gr-search-panel" onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div className="gr-search-header">
          <div className="gr-search-input-wrap">
            <Search size={22} className="gr-search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="gr-search-input"
              placeholder="Search plants, saplings, vermicompost, pots, or sellers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search listings"
            />
            {query && (
              <button
                type="button"
                className="gr-search-clear-btn"
                onClick={() => setQuery('')}
                title="Clear query"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            className="gr-modal-close-btn"
            onClick={handleClose}
            aria-label="Close search"
          >
            <X size={20} />
            <span className="gr-kbd-hint">ESC</span>
          </button>
        </div>

        {/* Quick Filter Pills */}
        <div className="gr-search-pills">
          {['All', 'Plants', 'Manure & Soil', 'Pots & Planters', 'Under ₹50', 'Under ₹100'].map((f) => (
            <button
              key={f}
              type="button"
              className={`gr-search-pill ${selectedFilter === f ? 'active' : ''}`}
              onClick={() => setSelectedFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Popular keywords suggestions if no query */}
        {!query && (
          <div className="gr-search-suggestions">
            <span className="gr-suggestion-label">Popular Searches:</span>
            <div className="gr-suggestion-chips">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="gr-suggestion-chip"
                  onClick={() => setQuery(term)}
                >
                  <Search size={12} />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count & Meta */}
        <div className="gr-search-results-meta">
          <span>
            {query ? (
              <>Showing <strong>{filteredListings.length}</strong> results for &ldquo;{query}&rdquo;</>
            ) : (
              <>Browse <strong>{filteredListings.length}</strong> available neighbourhood listings</>
            )}
          </span>
        </div>

        {/* Results List / Grid */}
        <div className="gr-search-results-scroll">
          {filteredListings.length === 0 ? (
            <div className="gr-search-empty">
              <div className="gr-search-empty-icon">🌿</div>
              <h3>No matching plants or products found</h3>
              <p>We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try another term or clear your search to explore all community items.</p>
              <button
                type="button"
                className="btn-start-selling"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setQuery('')
                  setSelectedFilter('All')
                }}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="gr-search-results-grid">
              {filteredListings.map((item) => {
                const itemId = item._id || item.id
                const saved = isInWishlist(itemId)

                return (
                  <div key={itemId} className="gr-search-result-card">
                    <div className="gr-result-image-box">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = IMAGES.products.tulsi
                        }}
                      />
                      <button
                        type="button"
                        className={`gr-result-wishlist-btn ${saved ? 'active' : ''}`}
                        onClick={() => toggleWishlist(itemId)}
                        title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart
                          size={15}
                          fill={saved ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>

                    <div className="gr-result-content">
                      <div className="gr-result-category">{item.category}</div>
                      <h4 className="gr-result-title">{item.name}</h4>
                      <p className="gr-result-seller">
                        <MapPin size={11} /> {item.sellerName} &bull; {item.locality}
                      </p>

                      <div className="gr-result-footer">
                        <span className="gr-result-price">{formatINR(item.price)}</span>
                        <button
                          type="button"
                          className="gr-result-add-cart-btn"
                          onClick={() => addToCart(item, 1)}
                          title="Add to shopping cart"
                        >
                          <ShoppingBag size={14} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
