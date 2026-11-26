import { useRef, useState } from 'react'
import { Camera, Upload, Sparkles, Leaf, Sun, Droplets, Sprout, RotateCcw, LoaderCircle, ImagePlus, ShieldCheck, AlertCircle } from 'lucide-react'

const MAX_FILE_SIZE = 8 * 1024 * 1024

export default function AIPlantAdvisor() {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const chooseImage = (file) => {
    if (!file) return
    setError('')
    setResult(null)
    if (!file.type.startsWith('image/')) return setError('Please choose an image file (JPG, PNG or WEBP).')
    if (file.size > MAX_FILE_SIZE) return setError('Please choose an image smaller than 8 MB.')
    if (preview) URL.revokeObjectURL(preview)
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const identifyPlant = async () => {
    if (!image) return setError('Upload or capture a plant photo first.')
    setLoading(true); setError(''); setResult(null)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(image)
      })
      const response = await fetch('/api/identify-plant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: image.type }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Plant identification failed.')
      setResult(data)
    } catch (err) { setError(err.message || 'Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setImage(null); setPreview(''); setResult(null); setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  return (
    <section id="ai-advisor" className="section-padding advisor-section">
      <div className="site-container">
        <div className="plant-scan-layout">
          <div className="plant-scan-copy">
            <span className="section-badge"><Sparkles size={13} /> GREENROOTS AI LAB</span>
            <h2 className="section-title">Not sure what’s growing?</h2>
            <p className="section-desc">Take a photo of a plant and get a helpful identification with simple care guidance for your home garden.</p>
            <div className="scan-benefits">
              <div><span className="scan-benefit-icon"><Leaf size={17} /></span><span><b>Plant identification</b><small>Common and botanical name</small></span></div>
              <div><span className="scan-benefit-icon"><Sun size={17} /></span><span><b>Light & watering</b><small>Know what your plant needs</small></span></div>
              <div><span className="scan-benefit-icon"><Sprout size={17} /></span><span><b>Growing tips</b><small>Soil and everyday care advice</small></span></div>
            </div>
            <p className="scan-privacy"><ShieldCheck size={15} /> Your photo is sent for analysis only when you press Identify plant.</p>
          </div>

          <div className="plant-scan-card">
            <div className="scan-card-top"><div><span className="scan-live-dot" /> <b>Plant scanner</b></div><span className="scan-beta-label">BETA</span></div>
            {!preview ? (
              <div className="scan-upload-area">
                <div className="scan-upload-icon"><ImagePlus size={28} /></div>
                <h3>Show us your plant</h3>
                <p>Upload a clear photo of the leaves, flower or whole plant.</p>
                <div className="scan-upload-actions">
                  <button className="btn-primary" onClick={() => fileInputRef.current?.click()} type="button"><Upload size={16} /> Upload photo</button>
                  <button className="btn-secondary" onClick={() => cameraInputRef.current?.click()} type="button"><Camera size={16} /> Use camera</button>
                </div>
                <span className="scan-file-hint">JPG, PNG or WEBP · Max 8 MB</span>
              </div>
            ) : (
              <div className="scan-preview-area">
                <div className="scan-preview-image-wrap"><img src={preview} alt="Selected plant for identification" /><button className="scan-change-btn" type="button" onClick={reset}><RotateCcw size={14} /> Change photo</button></div>
                {!result && <button className="btn-primary scan-identify-btn" type="button" onClick={identifyPlant} disabled={loading}>{loading ? <><LoaderCircle className="spin" size={17} /> Analysing photo...</> : <><Sparkles size={16} /> Identify this plant</>}</button>}
              </div>
            )}
            <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/*" onChange={(e) => chooseImage(e.target.files?.[0])} />
            <input ref={cameraInputRef} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={(e) => chooseImage(e.target.files?.[0])} />
            {error && <div className="scan-error"><AlertCircle size={16} /> {error}</div>}
            {result && (
              <div className="scan-result">
                <div className="scan-result-heading"><span className="scan-result-icon"><Leaf size={18} /></span><div><small>LIKELY IDENTIFICATION</small><h3>{result.plantName || 'Plant identified'}</h3></div></div>
                {result.scientificName && <p className="scan-scientific">{result.scientificName}</p>}
                {result.confidence && <span className="scan-confidence">AI confidence: {result.confidence}</span>}
                {result.description && <p className="scan-result-description">{result.description}</p>}
                <div className="scan-care-grid">
                  <div><Sun size={17} /><b>Sunlight</b><span>{result.sunlight || 'Not available'}</span></div>
                  <div><Droplets size={17} /><b>Watering</b><span>{result.watering || 'Not available'}</span></div>
                  <div><Sprout size={17} /><b>Soil</b><span>{result.soil || 'Not available'}</span></div>
                </div>
                {Array.isArray(result.careTips) && result.careTips.length > 0 && <div className="scan-tips"><b>Care tips</b><ul>{result.careTips.map((tip, index) => <li key={index}>{tip}</li>)}</ul></div>}
                {result.caution && <p className="scan-caution">{result.caution}</p>}
                <button className="scan-again-btn" type="button" onClick={reset}>Scan another plant <RotateCcw size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
