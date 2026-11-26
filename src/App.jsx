import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HyperlocalDiscovery from './components/HyperlocalDiscovery'
import CategorySection from './components/CategorySection'
import NeighbourhoodListings from './components/NeighbourhoodListings'
import LocalGrowersSection from './components/LocalGrowersSection'
import OrganicManureSection from './components/OrganicManureSection'
import SellerCTA from './components/SellerCTA'
import AIPlantAdvisor from './components/AIPlantAdvisor'
import Footer from './components/Footer'
import SearchOverlay from './components/SearchOverlay'
import WishlistDrawer from './components/WishlistDrawer'
import CartDrawer from './components/CartDrawer'
import ProfileModal from './components/ProfileModal'
import { MarketplaceProvider } from './context/MarketplaceContext'

export default function App() {
  useEffect(() => {
    const targets = document.querySelectorAll('main > section, .category-card, .listing-card, .grower-card, .manure-card')
    targets.forEach((element) => element.classList.add('scroll-reveal'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' })
    targets.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <MarketplaceProvider>
      <div className="page-wrapper">
        {/* 1. Professional Navigation */}
        <Navbar />

        <main id="main-content">
          {/* 2. Main Hero */}
          <Hero />

          {/* 3. Locality and Radius Search */}
          <HyperlocalDiscovery />

          {/* 4. Popular Gardening Categories */}
          <CategorySection />

          {/* 5. Nearby Community Listings */}
          <NeighbourhoodListings />

          {/* 6. Fresh Plants from Local Growers */}
          <LocalGrowersSection />

          {/* 7. Manure and Gardening Essentials */}
          <OrganicManureSection />

          {/* 8. Become a Seller Section */}
          <SellerCTA />

          {/* 9. GreenRoots photo-based plant advisor */}
          <AIPlantAdvisor />
        </main>

        {/* 10. Professional Footer */}
        <Footer />

        {/* 11. Fully Functional Utility Modals and Drawers */}
        <SearchOverlay />
        <WishlistDrawer />
        <CartDrawer />
        <ProfileModal />
      </div>
    </MarketplaceProvider>
  )
}
