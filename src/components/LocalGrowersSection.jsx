import { MapPin, ArrowRight, Store, Sprout } from 'lucide-react'
import { IMAGES } from '../utils/imageRegistry'

export default function LocalGrowersSection() {
  const growers = [
    {
      id: 'lakshmi-nursery',
      name: 'Lakshmi Nursery',
      type: 'Neighborhood Nursery',
      locality: 'BTM Layout, Bengaluru',
      distance: '2.1 km away',
      specialty: 'Flowering marigold plants, desi rose saplings, and puja flowers ready for potting.',
      activeListings: 18,
      image: IMAGES.categories.floweringPlants,
    },
    {
      id: 'kumhar-potters',
      name: 'Kumhar Colony Potters',
      type: 'Traditional Pottery Cluster',
      locality: 'Malleswaram, Bengaluru',
      distance: '3.8 km away',
      specialty: 'Handcrafted porous terracotta mitti gamlas, clay saucer trays, and durable hanging pots.',
      activeListings: 12,
      image: IMAGES.categories.potsPlanters,
    },
    {
      id: 'green-leaf',
      name: 'Green Leaf Local Nursery',
      type: 'Family-Run Plant Stand',
      locality: 'Jayanagar, Bengaluru',
      distance: '4.5 km away',
      specialty: 'Grafted Kagzi lemon, sweet guava, and dwarf mango saplings acclimated for terrace drums.',
      activeListings: 24,
      image: IMAGES.categories.fruitPlants,
    },
  ]

  return (
    <section id="local-growers" className="section-padding local-growers-section">
      <div className="site-container">
        <div className="section-header-row">
          <div>
            <div className="section-badge">Community Nurseries &amp; Artisans</div>
            <h2 className="section-title">Fresh Plants from Local Growers</h2>
            <p className="section-desc">
              Connect directly with independent plant growers, terrace gardeners, and traditional potters in your city sector.
            </p>
          </div>
          <a href="#neighbourhood" className="link-inline">
            <span>View All Nearby Sellers</span>
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="growers-grid">
          {growers.map((grower) => (
            <article key={grower.id} className="grower-card">
              <div className="grower-media-wrap">
                <img
                  src={grower.image}
                  alt={grower.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = IMAGES.categories.floweringPlants
                  }}
                />
                <span className="grower-distance-tag">
                  <MapPin size={11} /> {grower.distance}
                </span>
              </div>

              <div className="grower-card-body">
                <div className="grower-title-row">
                  <h3 className="grower-name">{grower.name}</h3>
                  <span className="grower-type-pill">{grower.type}</span>
                </div>

                <div className="grower-locality">
                  <MapPin size={12} />
                  <span>{grower.locality}</span>
                </div>

                <p className="grower-desc">{grower.specialty}</p>

                <div className="grower-card-footer">
                  <span className="grower-listings-count">
                    <Sprout size={13} /> {grower.activeListings} items listed
                  </span>
                  <a href="#neighbourhood" className="btn-view-grower">
                    <Store size={13} />
                    <span>View Stand</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
