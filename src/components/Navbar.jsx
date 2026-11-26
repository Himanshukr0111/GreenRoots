import { useState, useEffect } from 'react'
import { Search, Heart, User, ShoppingBag, Menu, X, PlusCircle } from 'lucide-react'
import { useMarketplace } from '../context/useMarketplace'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const {
    wishlistCount,
    cartCount,
    openSearch,
    openWishlist,
    openCart,
    openProfile,
    scrollToSellerSection,
    user,
  } = useMarketplace()

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Explore Plants', href: '#neighbourhood' },
    { name: 'Manure & Compost', href: '#compost-soil' },
    { name: 'Pots & Supplies', href: '#categories' },
    { name: 'Local Growers', href: '#local-growers' },
    { name: 'Plant Advisor', href: '#ai-advisor' },
  ]

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isMobileMenuOpen])

  const handleStartSellingClick = (e) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    scrollToSellerSection()
  }

  return (
    <header className="site-header">
      {/* Top Banner Ribbon */}
      <div className="announcement-bar">
        <div className="site-container announcement-inner">
          <span>India&apos;s Hyperlocal Gardening Marketplace &bull; Buy &amp; sell plants directly with nearby neighbours</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <nav className="site-navbar" aria-label="Main Navigation">
        <div className="site-container navbar-inner">
          {/* 1. Left: Brand Logo */}
          <div className="nav-left">
            <a href="#" className="brand-logo" aria-label="GreenRoots Homepage">
              <span className="brand-logo-text">GreenRoots</span>
              <span className="brand-tag">HYPERLOCAL</span>
            </a>
          </div>

          {/* 2. Middle: Navigation Links */}
          <ul className="nav-menu">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <a href={link.href} className="nav-link">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* 3. Right: Utility Actions & Start Selling */}
          <div className="nav-right">
            {/* Search Button */}
            <button
              type="button"
              className="action-btn"
              onClick={openSearch}
              aria-label="Search listings"
              title="Search plants & products"
            >
              <Search size={18} strokeWidth={2} />
            </button>

            {/* Wishlist Button with dynamic count */}
            <button
              type="button"
              className="action-btn"
              onClick={openWishlist}
              aria-label="Wishlist"
              title={`Wishlist (${wishlistCount} saved)`}
            >
              <Heart size={18} strokeWidth={2} />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </button>

            {/* Profile / Account Button */}
            <button
              type="button"
              className={`action-btn ${user ? 'user-active' : ''}`}
              onClick={openProfile}
              aria-label="My Account"
              title={user ? `Account: ${user.name}` : 'Login / Register'}
            >
              <User size={18} strokeWidth={2} />
              {user && <span className="user-online-dot" />}
            </button>

            {/* Cart Button with dynamic count */}
            <button
              type="button"
              className="action-btn"
              onClick={openCart}
              aria-label="Shopping Cart"
              title={`Cart (${cartCount} items)`}
            >
              <ShoppingBag size={18} strokeWidth={2} />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </button>

            {/* Start Selling Button */}
            <button
              type="button"
              onClick={handleStartSellingClick}
              className="btn-start-selling"
              title="Sell your plants locally"
            >
              <PlusCircle size={15} />
              <span>Start Selling</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer & Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="mobile-nav-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header">
            <span className="mobile-brand-title">Menu</span>
            <button
              type="button"
              className="action-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Utility Actions Bar */}
          <div className="mobile-utility-strip">
            <button
              type="button"
              className="mobile-util-btn"
              onClick={() => {
                setIsMobileMenuOpen(false)
                openSearch()
              }}
            >
              <Search size={18} />
              <span>Search</span>
            </button>

            <button
              type="button"
              className="mobile-util-btn"
              onClick={() => {
                setIsMobileMenuOpen(false)
                openWishlist()
              }}
            >
              <div className="util-icon-rel">
                <Heart size={18} />
                {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
              </div>
              <span>Wishlist</span>
            </button>

            <button
              type="button"
              className="mobile-util-btn"
              onClick={() => {
                setIsMobileMenuOpen(false)
                openCart()
              }}
            >
              <div className="util-icon-rel">
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
              </div>
              <span>Cart</span>
            </button>

            <button
              type="button"
              className="mobile-util-btn"
              onClick={() => {
                setIsMobileMenuOpen(false)
                openProfile()
              }}
            >
              <User size={18} />
              <span>{user ? user.name : 'Account'}</span>
            </button>
          </div>

          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-nav-footer">
            <button
              type="button"
              onClick={handleStartSellingClick}
              className="btn-start-selling-mobile"
            >
              <PlusCircle size={16} />
              <span>Start Selling Plants from Home</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
