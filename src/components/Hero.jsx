import { ArrowRight, MapPin, Users, Store, ShieldCheck } from 'lucide-react'
import { IMAGES } from '../utils/imageRegistry'

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="site-container">
        <div className="hero-grid">
          {/* Left Column: Commercial Editorial Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Indian Hyperlocal Gardening Community</span>
            </div>

            <h1 className="hero-heading">
              Beautiful plants.
              <span className="hero-heading-sub">Grown closer to home.</span>
            </h1>

            <p className="hero-subtext">
              Discover affordable plants, fresh manure, gardening essentials and independent growers in your neighbourhood.
            </p>

            <div className="hero-actions">
              <a href="#neighbourhood" className="btn-primary">
                <span>Explore Nearby Plants</span>
                <ArrowRight size={17} />
              </a>
              <a href="#sell-plants" className="btn-secondary">
                <span>Start Selling</span>
              </a>
            </div>

            {/* Hyperlocal Value Highlights */}
            <div className="hero-highlights-strip">
              <div className="highlight-item">
                <Users size={16} className="highlight-icon" />
                <span>Balcony &amp; Terrace Growers</span>
              </div>
              <div className="highlight-item">
                <MapPin size={16} className="highlight-icon" />
                <span>Direct Local Pickup</span>
              </div>
              <div className="highlight-item">
                <Store size={16} className="highlight-icon" />
                <span>Fair Community Prices</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Indian Terrace Garden Visual */}
          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img
                src={IMAGES.heroBalconyGarden}
                alt="Thriving Indian balcony terrace garden with potted plants in terracotta gamlas"
                loading="eager"
              />
              <div className="hero-caption-card">
                <div className="caption-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="caption-title">Neighbourhood Plant Exchange</div>
                  <div className="caption-desc">Direct transactions with nearby home gardeners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
