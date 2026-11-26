import { Camera, IndianRupee, Truck, MessageCircle, ArrowRight, Check } from 'lucide-react'
import SellerForm from './SellerForm'
import { useMarketplace } from '../context/useMarketplace'

export default function SellerCTA() {
  const { scrollToSellerSection } = useMarketplace()

  const steps = [
    {
      number: '01',
      icon: Camera,
      title: 'Upload Plant Photos',
      desc: 'Take photos of extra cuttings, balcony saplings, or homemade compost directly from your phone.',
    },
    {
      number: '02',
      icon: IndianRupee,
      title: 'Set Your Own Price',
      desc: 'Complete pricing freedom. List at community rates (e.g. ₹40 for Tulsi, ₹70 for Hibiscus) or offer free giveaways.',
    },
    {
      number: '03',
      icon: Truck,
      title: 'Choose Pickup or Delivery',
      desc: 'Allow buyers to collect directly from your building gate or arrange local neighbourhood delivery independently.',
    },
    {
      number: '04',
      icon: MessageCircle,
      title: 'Connect with Local Buyers',
      desc: 'Chat directly with plant enthusiasts in your neighbourhood, coordinate timings safely, and grow your local network.',
    },
  ]

  return (
    <section id="sell-plants" className="section-padding seller-cta-section">
      <div className="site-container">
        <div className="seller-box">
          <div className="seller-header">
            <div className="section-badge badge-on-dark">Turn Extra Greenery into Opportunity</div>
            <h2 className="seller-title">Your plants deserve a new home.</h2>
            <p className="seller-desc">
              Have extra plants growing on your balcony or terrace? Turn your gardening hobby into an opportunity. List your plants, set your price and connect with buyers nearby.
            </p>
            <div className="seller-action">
              <button
                type="button"
                onClick={scrollToSellerSection}
                className="btn-seller-primary"
              >
                <span>Start Selling</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* 4 Step Pillars */}
          <div className="seller-steps-row">
            {steps.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.number} className="step-card">
                  <div className="step-badge">{s.number}</div>
                  <div className="step-icon-box">
                    <Icon size={20} />
                  </div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-text">{s.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Embedded Interactive Seller Listing Form */}
          <SellerForm />

          {/* Value Strip */}
          <div className="seller-guarantee-strip">
            <div className="guarantee-item">
              <Check size={14} className="check-icon" />
              <span>No commission for individual terrace growers</span>
            </div>
            <div className="guarantee-item">
              <Check size={14} className="check-icon" />
              <span>Direct customer inquiries via call or chat</span>
            </div>
            <div className="guarantee-item">
              <Check size={14} className="check-icon" />
              <span>Safe local gate pickup with zero courier packaging</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
