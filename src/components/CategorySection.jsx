import { CATEGORIES as DEFAULT_CATEGORIES } from '../utils/marketplaceData'
import { useMarketplace } from '../context/useMarketplace'
import { IMAGES } from '../utils/imageRegistry'

export default function CategorySection() {
  const { categories, setSelectedCategory } = useMarketplace()
  const displayCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName)
    const el = document.getElementById('neighbourhood')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="categories" className="section-padding categories-section">
      <div className="site-container">
        <div className="section-header">
          <div className="section-badge">Indian Gardening Essentials</div>
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-desc">
            Browse through home-grown cuttings, flowering balcony saplings, organic vermicompost, and terracotta gamlas from nearby community sellers.
          </p>
        </div>

        <div className="categories-grid">
          {displayCategories.map((cat) => (
            <div
              key={cat.slug || cat.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick(cat.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCategoryClick(cat.name)
                }
              }}
              className="category-card"
              style={{ cursor: 'pointer' }}
            >
              <div className="category-image-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = IMAGES.categories.indoorPlants
                  }}
                />
              </div>
              <div className="category-body">
                <h3 className="category-title">{cat.name}</h3>
                <p className="category-subtitle">{cat.subtitle}</p>
                <span className="category-meta-tag">{cat.popularIn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
