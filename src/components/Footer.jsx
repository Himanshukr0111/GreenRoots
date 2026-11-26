import { MapPin } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col-brand">
            <a href="#" className="brand-logo footer-logo">
              <span className="brand-logo-text" style={{ color: 'var(--color-warm-cream)' }}>GreenRoots</span>
              <span className="brand-tag" style={{ color: 'var(--color-sage-light)' }}>HYPERLOCAL</span>
            </a>
            <p className="footer-tagline">
              India&apos;s community marketplace for rooftop gardeners, balcony plant growers, and neighbourhood nurseries. Buy, sell, and exchange plants and organic compost locally.
            </p>
            <div className="footer-location-strip">
              <MapPin size={15} />
              <span>Active in Bengaluru &bull; Expanding across Indian cities</span>
            </div>
          </div>

          {/* Gardening Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Gardening Categories</h4>
            <ul className="footer-nav-list">
              <li><a href="#categories">Small &amp; Indoor Plants</a></li>
              <li><a href="#categories">Balcony Flowering Plants</a></li>
              <li><a href="#categories">Fruit &amp; Grafted Saplings</a></li>
              <li><a href="#compost-soil">Vermicompost &amp; Gobar Khaad</a></li>
              <li><a href="#compost-soil">Terracotta Mitti Gamlas</a></li>
              <li><a href="#categories">Seeds &amp; Gardening Tools</a></li>
            </ul>
          </div>

          {/* Peer-to-Peer Community */}
          <div className="footer-col">
            <h4 className="footer-heading">Community &amp; Selling</h4>
            <ul className="footer-nav-list">
              <li><a href="#sell-plants">Sell Extra Balcony Plants</a></li>
              <li><a href="#sell-plants">List Organic Compost</a></li>
              <li><a href="#neighbourhood">Hyperlocal Search by Radius</a></li>
              <li><a href="#local-growers">Find Neighbourhood Nurseries</a></li>
              <li><a href="#ai-advisor">Plant Advisor (Coming Soon)</a></li>
            </ul>
          </div>

          {/* Marketplace Rules & Safety */}
          <div className="footer-col">
            <h4 className="footer-heading">Marketplace Guidelines</h4>
            <ul className="footer-nav-list">
              <li><a href="#guidelines">Safe Gate Pickups</a></li>
              <li><a href="#guidelines">Seller-Arranged Local Delivery</a></li>
              <li><a href="#guidelines">Direct Inquiries Without Middlemen</a></li>
              <li><a href="#guidelines">Fair Community Pricing</a></li>
              <li><a href="#guidelines">Help &amp; Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {CURRENT_YEAR} GreenRoots India. Built for Indian home gardeners, terrace plant lovers, and local nurseries.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#standards">Community Standards</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
