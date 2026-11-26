import { useState, useRef } from 'react'
import { PlusCircle, UploadCloud, CheckCircle2, Image as ImageIcon, MapPin, IndianRupee, Tag, Loader2, User } from 'lucide-react'
import { useMarketplace } from '../context/useMarketplace'
import { IMAGES } from '../utils/imageRegistry'
import { api } from '../services/api'

const SAMPLE_IMAGE_OPTIONS = [
  { label: 'Tulsi Sapling', url: IMAGES.products.tulsi },
  { label: 'Money Plant', url: IMAGES.products.moneyPlant },
  { label: 'Hibiscus Bush', url: IMAGES.products.hibiscus },
  { label: 'Desi Rose', url: IMAGES.products.desiRose },
  { label: 'Vermicompost', url: IMAGES.products.vermicompost },
  { label: 'Terracotta Gamla', url: IMAGES.products.terracottaGamla },
]

export default function SellerForm() {
  const { addListing, user, openProfile } = useMarketplace()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Small & Indoor Plants')
  const [description, setDescription] = useState('')
  const [customLocality, setCustomLocality] = useState(null)
  const locality = customLocality ?? (user?.locality || 'Indiranagar, Bengaluru')
  const [imagePreview, setImagePreview] = useState(IMAGES.products.tulsi)
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [uploadNotice, setUploadNotice] = useState('')

  const fileInputRef = useRef(null)

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG, WebP)')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large (max 5MB)')
        return
      }
      setError('')
      setUploadNotice('')
      setSelectedImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide a plant or product name')
      return
    }
    const numPrice = Number(price)
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please provide a valid price in INR')
      return
    }
    if (!description.trim()) {
      setError('Please provide a brief description for your neighbours')
      return
    }

    setError('')
    setUploadNotice('')
    setIsSubmitting(true)

    let finalImageUrl = imagePreview

    // 1. If an image file was selected from device, upload it to Cloudinary via backend
    if (selectedImageFile) {
      setIsUploadingImage(true)
      try {
        const formData = new FormData()
        formData.append('image', selectedImageFile)
        const uploadRes = await api.upload.uploadImage(formData)
        if (uploadRes && uploadRes.url) {
          finalImageUrl = uploadRes.url
        }
      } catch (uploadErr) {
        console.warn('Cloudinary upload notice:', uploadErr.message)
        setUploadNotice('Cloudinary not configured or offline; listing published with local image fallback.')
      } finally {
        setIsUploadingImage(false)
      }
    }

    // 2. Submit product listing with Cloudinary URL or fallback image
    try {
      await addListing({
        name: name.trim(),
        price: numPrice,
        category,
        description: description.trim(),
        locality: locality.trim() || 'Indiranagar, Bengaluru',
        image: finalImageUrl,
      })

      setIsSubmitted(true)
      setName('')
      setPrice('')
      setDescription('')
      setSelectedImageFile(null)

      // Smooth scroll down to neighbourhood listings to see the new item
      setTimeout(() => {
        const el = document.getElementById('neighbourhood')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 1600)
    } catch (err) {
      setError(err.message || 'Could not publish listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="seller-form-container" id="seller-listing-form">
      <div className="seller-form-card">
        <div className="seller-form-header">
          <div className="section-badge badge-on-dark" style={{ alignSelf: 'flex-start' }}>
            List Your Item in 2 Minutes
          </div>
          <h3 className="seller-form-title">List Your Plants or Garden Supplies</h3>
          <p className="seller-form-subtitle">
            Directly connect with nearby plant lovers in your area. Zero listing fees, zero courier hassles.
          </p>

          {!user && (
            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-primary-dark)' }}>
              <User size={15} />
              <span>Listing as Guest Grower.</span>
              <button
                type="button"
                onClick={openProfile}
                style={{ textDecoration: 'underline', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }}
              >
                Sign in to link to your account
              </button>
            </div>
          )}
        </div>

        {isSubmitted ? (
          <div className="seller-form-success">
            <CheckCircle2 size={46} className="gr-icon-success" />
            <h4>Listing Published Successfully!</h4>
            <p>
              Your listing is now saved in MongoDB and live in the community marketplace. Neighbours nearby can view, save, and contact you for local pickup.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsSubmitted(false)}
            >
              <PlusCircle size={16} />
              <span>List Another Plant</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="seller-listing-form">
            {error && <div className="gr-auth-error">{error}</div>}
            {uploadNotice && (
              <div style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.65rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
                {uploadNotice}
              </div>
            )}

            <div className="seller-form-grid">
              {/* Product Name */}
              <div className="gr-form-group">
                <label htmlFor="seller-prod-name">Plant / Product Name *</label>
                <div className="gr-input-icon-wrap">
                  <Tag size={16} className="gr-input-icon" />
                  <input
                    id="seller-prod-name"
                    type="text"
                    placeholder="e.g. Variegated Peace Lily, Desi Rose cutting"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="gr-form-input"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="gr-form-group">
                <label htmlFor="seller-prod-price">Price (₹ INR) *</label>
                <div className="gr-input-icon-wrap">
                  <IndianRupee size={16} className="gr-input-icon" />
                  <input
                    id="seller-prod-price"
                    type="number"
                    min="0"
                    step="5"
                    placeholder="e.g. 50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="gr-form-input"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="gr-form-group">
                <label htmlFor="seller-prod-cat">Category *</label>
                <select
                  id="seller-prod-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="gr-form-select"
                >
                  <option value="Small & Indoor Plants">Small &amp; Indoor Plants</option>
                  <option value="Flowering Plants">Flowering Plants</option>
                  <option value="Fruit & Hybrid Plants">Fruit &amp; Hybrid Plants</option>
                  <option value="Organic Manure & Compost">Organic Manure &amp; Compost</option>
                  <option value="Pots & Planters">Pots &amp; Planters</option>
                  <option value="Seeds & Saplings">Seeds &amp; Saplings</option>
                  <option value="Gardening Accessories">Gardening Accessories</option>
                </select>
              </div>

              {/* Locality */}
              <div className="gr-form-group">
                <label htmlFor="seller-prod-loc">Your Neighbourhood / Locality</label>
                <div className="gr-input-icon-wrap">
                  <MapPin size={16} className="gr-input-icon" />
                  <input
                    id="seller-prod-loc"
                    type="text"
                    placeholder="e.g. Indiranagar, Bengaluru"
                    value={locality}
                    onChange={(e) => setCustomLocality(e.target.value)}
                    className="gr-form-input"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="gr-form-group">
              <label htmlFor="seller-prod-desc">Description &amp; Care Details *</label>
              <textarea
                id="seller-prod-desc"
                rows="3"
                placeholder="Mention pot size, health of cuttings, soil type used, or care tips..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="gr-form-textarea"
              />
            </div>

            {/* Image Upload & Selection */}
            <div className="seller-image-upload-wrap">
              <label className="seller-upload-label">
                <ImageIcon size={16} />
                <span>Upload Product Image</span>
              </label>

              <div className="seller-image-control-row">
                {/* Image preview */}
                <div className="seller-preview-box">
                  <img
                    src={imagePreview}
                    alt="Listing preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = IMAGES.products.tulsi
                    }}
                  />
                </div>

                <div className="seller-upload-actions">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn-upload-file"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud size={16} />
                    <span>Upload From Device</span>
                  </button>
                  <span className="seller-upload-hint">or choose a sample photo below:</span>

                  <div className="seller-sample-chips">
                    {SAMPLE_IMAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        className={`seller-sample-chip ${imagePreview === opt.url ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedImageFile(null)
                          setImagePreview(opt.url)
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-seller-primary btn-submit-listing"
              disabled={isSubmitting || isUploadingImage}
            >
              {isUploadingImage ? (
                <>
                  <Loader2 size={17} className="spin" />
                  <span>Uploading Image to Cloudinary...</span>
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 size={17} className="spin" />
                  <span>Publishing to MongoDB...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={17} />
                  <span>Publish Listing to Neighbourhood</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
