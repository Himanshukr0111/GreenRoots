import { useEffect } from 'react'
import { X, Heart, ShoppingBag, Trash2, ArrowRight, MapPin } from 'lucide-react'
import { useMarketplace } from '../context/useMarketplace'
import { formatINR } from '../utils/formatters'
import { IMAGES } from '../utils/imageRegistry'

export default function WishlistDrawer() {
  const {
    isWishlistOpen,
    closeWishlist,
    wishlistItems,
    wishlistCount,
    toggleWishlist,
    addToCart,
    openCart,
  } = useMarketplace()

  // Prevent body scroll when open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isWishlistOpen])

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        closeWishlist()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isWishlistOpen, closeWishlist])

  if (!isWishlistOpen) return null

  return (
    <div className="gr-drawer-backdrop" onClick={closeWishlist} role="dialog" aria-modal="true" aria-label="My Wishlist">
      <div className="gr-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gr-drawer-header">
          <div className="gr-drawer-title-wrap">
            <Heart size={20} className="gr-drawer-icon" fill="var(--color-primary)" />
            <h3>Saved Plants &amp; Supplies</h3>
            <span className="gr-drawer-badge">{wishlistCount}</span>
          </div>
          <button
            type="button"
            className="gr-modal-close-btn"
            onClick={closeWishlist}
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="gr-drawer-content">
          {wishlistItems.length === 0 ? (
            <div className="gr-drawer-empty">
              <div className="gr-empty-icon-box">
                <Heart size={36} strokeWidth={1.5} />
              </div>
              <h4>Your wishlist is currently empty</h4>
              <p>
                Browse through plants, saplings, and manure from local growers. Click the heart icon on any card to save your favourite greenery here.
              </p>
              <button
                type="button"
                className="btn-start-selling"
                onClick={() => {
                  closeWishlist()
                  const sec = document.getElementById('neighbourhood')
                  if (sec) sec.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span>Browse Local Plants</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="gr-drawer-items-list">
              {wishlistItems.map((item) => {
                const itemId = item._id || item.id

                return (
                  <div key={itemId} className="gr-wishlist-item-card">
                    <div className="gr-wishlist-item-img">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = IMAGES.products.tulsi
                        }}
                      />
                    </div>

                    <div className="gr-wishlist-item-details">
                      <span className="gr-item-cat">{item.category}</span>
                      <h4 className="gr-item-title">{item.name}</h4>
                      <div className="gr-item-seller">
                        <MapPin size={11} />
                        <span>{item.sellerName} &bull; {item.locality}</span>
                      </div>
                      <div className="gr-item-price-row">
                        <span className="gr-item-price">{formatINR(item.price)}</span>
                        <div className="gr-item-actions">
                          <button
                            type="button"
                            className="gr-btn-add-cart"
                            onClick={() => {
                              addToCart(item, 1)
                            }}
                            title="Add to shopping cart"
                          >
                            <ShoppingBag size={14} />
                            <span>Add to Cart</span>
                          </button>
                          <button
                            type="button"
                            className="gr-btn-remove"
                            onClick={() => toggleWishlist(itemId)}
                            title="Remove from saved"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="gr-drawer-footer">
            <div className="gr-wishlist-summary-hint">
              <span>Saved items persist automatically on your device.</span>
            </div>
            <div className="gr-drawer-footer-actions">
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  wishlistItems.forEach((item) => addToCart(item, 1))
                  closeWishlist()
                  openCart()
                }}
              >
                <ShoppingBag size={16} />
                <span>Move All to Cart ({wishlistItems.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
