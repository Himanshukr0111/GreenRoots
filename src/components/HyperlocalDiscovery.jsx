import { useState } from 'react'
import { MapPin, Search, Navigation, SlidersHorizontal, Info } from 'lucide-react'

export default function HyperlocalDiscovery() {
  const [city, setCity] = useState('Bengaluru')
  const [locality, setLocality] = useState('Indiranagar')
  const [pinCode, setPinCode] = useState('560038')
  const [radius, setRadius] = useState('3')
  const [fulfilment, setFulfilment] = useState('all')

  const indianCities = [
    'Bengaluru',
    'Delhi NCR',
    'Mumbai',
    'Pune',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Chandigarh',
  ]

  const handleSearch = (e) => {
    e.preventDefault()
  }

  return (
    <section className="discovery-section">
      <div className="site-container">
        <form className="discovery-card" onSubmit={handleSearch}>
          <div className="discovery-fields-grid">
            {/* City Selector */}
            <div className="discovery-field">
              <label htmlFor="city-select" className="field-label">
                City
              </label>
              <select
                id="city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="discovery-select"
              >
                {indianCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Locality Input */}
            <div className="discovery-field">
              <label htmlFor="locality-input" className="field-label">
                Locality / Area
              </label>
              <div className="input-group">
                <MapPin size={15} className="input-icon" />
                <input
                  id="locality-input"
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Koramangala or Sector 62"
                  className="discovery-input"
                />
              </div>
            </div>

            {/* PIN Code */}
            <div className="discovery-field">
              <label htmlFor="pincode-input" className="field-label">
                PIN Code
              </label>
              <input
                id="pincode-input"
                type="text"
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="6-digit PIN"
                className="discovery-input-compact"
              />
            </div>

            {/* Radius */}
            <div className="discovery-field">
              <label htmlFor="radius-select" className="field-label">
                Search Radius
              </label>
              <div className="input-group">
                <SlidersHorizontal size={14} className="input-icon" />
                <select
                  id="radius-select"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="discovery-select"
                >
                  <option value="1">Within 1 km (Walking)</option>
                  <option value="3">Within 3 km (Neighbourhood)</option>
                  <option value="5">Within 5 km (Vicinity)</option>
                  <option value="10">Within 10 km (Sector)</option>
                  <option value="20">Within 20 km (City wide)</option>
                </select>
              </div>
            </div>

            {/* Fulfilment Filter */}
            <div className="discovery-field">
              <label className="field-label">Fulfilment</label>
              <div className="fulfilment-toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${fulfilment === 'all' ? 'active' : ''}`}
                  onClick={() => setFulfilment('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${fulfilment === 'pickup' ? 'active' : ''}`}
                  onClick={() => setFulfilment('pickup')}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${fulfilment === 'delivery' ? 'active' : ''}`}
                  onClick={() => setFulfilment('delivery')}
                >
                  Delivery
                </button>
              </div>
            </div>

            {/* Search Button */}
            <div className="discovery-action-wrap">
              <button type="submit" className="btn-find-plants">
                <Search size={16} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* Transparent Demo Notice */}
        <div className="discovery-status-strip">
          <Info size={14} className="info-icon" />
          <span>
            <strong>Location Discovery Preview:</strong> Showing illustrative demo listings in <em>{locality}, {city}</em> within <strong>{radius} km</strong>. Real GPS coordinates and seller locations will be enabled with backend integration.
          </span>
          <button
            type="button"
            className="btn-quick-nearby"
            onClick={() => {
              setLocality('Koramangala 4th Block')
              setPinCode('560034')
              setRadius('3')
            }}
          >
            <Navigation size={12} />
            <span>Try Koramangala (3 km)</span>
          </button>
        </div>
      </div>
    </section>
  )
}
