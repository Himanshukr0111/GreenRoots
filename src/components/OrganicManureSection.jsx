import { useState } from 'react'
import { Check, ShoppingBag, ArrowUpRight } from 'lucide-react'
import { formatINR } from '../utils/formatters'
import { IMAGES } from '../utils/imageRegistry'
import { useMarketplace } from '../context/useMarketplace'

export default function OrganicManureSection() {
  const { addToCart } = useMarketplace()
  const [addedMap, setAddedMap] = useState({})

  const supplies = [
    {
      id: 'vermicompost-pack',
      name: 'Organic Vermicompost (Kechua Khaad)',
      category: 'Organic Soil Food',
      price: 80,
      packaging: '2 kg Sealed Bag',
      sellerName: 'Manoj Kumar',
      seller: 'Manoj Kumar (Urban Composter)',
      locality: 'Whitefield, Bengaluru',
      image: IMAGES.products.vermicompost,
      description: 'Pure earthworm castings with beneficial microbes for lush leaf growth.',
    },
    {
      id: 'gobar-khaad',
      name: 'Aged Cow Dung Manure (Gobar Khaad)',
      category: 'Traditional Manure',
      price: 75,
      packaging: '5 kg Eco-Sack',
      sellerName: 'Shri Krishna Dairy',
      seller: 'Shri Krishna Dairy & Garden',
      locality: 'Yelahanka, Bengaluru',
      image: IMAGES.products.cowDungManure,
      description: 'Fully decomposed 2-year old gobar khaad. Odourless and cool for roots.',
    },
    {
      id: 'cocopeat-block',
      name: 'Washed Low-EC Cocopeat Brick',
      category: 'Growing Medium',
      price: 90,
      packaging: '5 kg Compressed Brick',
      sellerName: 'Kaveri Coir Products',
      seller: 'Kaveri Coir Products',
      locality: 'Koramangala, Bengaluru',
      image: IMAGES.products.cocopeat,
      description: 'Expands up to 75 litres with water. Retains moisture for terrace pots.',
    },
    {
      id: 'terracotta-gamla',
      name: 'Traditional Terracotta Mitti Gamla',
      category: 'Pots & Planters',
      price: 50,
      packaging: '8-Inch Porous Clay',
      sellerName: 'Kumhar Colony Potters',
      seller: 'Kumhar Colony Potters',
      locality: 'Malleswaram, Bengaluru',
      image: IMAGES.products.terracottaGamla,
      description: 'Hand-shaped porous clay pot with bottom drain hole. Keeps mitti cool.',
    },
  ]

  const handleAdd = (item) => {
    addToCart(item, 1)
    setAddedMap((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }))
    }, 1500)
  }

  return (
    <section id="compost-soil" className="section-padding essentials-section">
      <div className="site-container">
        {/* Hyperlocal Commercial Advantage Banner */}
        <div className="essentials-banner">
          <div className="essentials-banner-content">
            <span className="section-eyebrow" style={{ color: 'var(--color-sage-light)' }}>
              Heavy Supplies &bull; Hyperlocal Pickup
            </span>
            <h3>Heavy soil, mitti &amp; manure? Buy directly from nearby composters.</h3>
            <p>
              Ordering 5 kg to 20 kg soil bags through standard e-commerce incurs high courier shipping fees. On GreenRoots, pick up vermicompost, aged gobar khaad, and terracotta gamlas directly from neighbourhood composters and pottery artisans at fair local prices.
            </p>
            <div className="essentials-perks">
              <span className="perk-pill">
                <Check size={14} /> Zero Expensive Courier Delivery Fees
              </span>
              <span className="perk-pill">
                <Check size={14} /> 100% Decomposed &amp; Weed-Free
              </span>
              <span className="perk-pill">
                <Check size={14} /> Support Local Potters &amp; Composters
              </span>
            </div>
          </div>
          <div className="essentials-banner-image">
            <img
              src={IMAGES.categories.manureCompost}
              alt="Rich organic compost prepared locally by community composters"
              loading="lazy"
            />
          </div>
        </div>

        {/* Section Heading & Grid */}
        <div className="section-header with-action">
          <div>
            <span className="section-eyebrow">Affordable Garden Essentials</span>
            <h2 className="section-title">Organic Manure, Compost &amp; Gamlas</h2>
            <p className="section-desc">
              Priced reasonably by community growers and small producers for thriving balcony and rooftop gardens.
            </p>
          </div>
          <a href="#neighbourhood" className="view-all-link">
            Explore All Manure &amp; Pots <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="products-grid">
          {supplies.map((item) => {
            const isAdded = addedMap[item.id]

            return (
              <article key={item.id} className="product-card">
                <div className="product-media-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = IMAGES.products.vermicompost
                    }}
                  />
                </div>

                <div className="product-content">
                  <span className="seller-type-pill" style={{ marginBottom: '0.4rem', alignSelf: 'flex-start' }}>
                    {item.category}
                  </span>

                  <h3 className="product-title" style={{ fontSize: '1.15rem' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-muted)', marginBottom: '0.25rem' }}>
                    {item.packaging}
                  </p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--color-deep-green)', fontWeight: 600, marginBottom: '0.85rem' }}>
                    {item.seller}
                  </p>

                  <div className="product-meta-row">
                    <div>
                      <span className="product-price">{formatINR(item.price)}</span>
                      <span className="stock-qty-text">Direct Seller Price</span>
                    </div>
                    <button
                      type="button"
                      className="btn-add-bag"
                      onClick={() => handleAdd(item)}
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
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
