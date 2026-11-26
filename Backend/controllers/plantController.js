const { GoogleGenAI } = require('@google/genai')

// @desc    Identify plant from photo using Google Gemini AI
// @route   POST /api/identify-plant
// @access  Public
const identifyPlant = async (req, res, next) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return res.status(503).json({
        error: 'AI is not configured yet. Add GEMINI_API_KEY to your Backend .env file and restart the server.',
      })
    }

    const { image, mimeType } = req.body

    if (!image) {
      return res.status(400).json({
        error: 'Please upload or capture a plant photo first.',
      })
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/avif']
    const safeMimeType = mimeType && allowedMimeTypes.includes(mimeType.toLowerCase())
      ? mimeType.toLowerCase()
      : 'image/jpeg'

    // Clean Base64 string if it contains data URI header
    const cleanBase64 = typeof image === 'string' && image.includes(',')
      ? image.split(',')[1]
      : image

    const prompt = `You are GreenRoots Plant Advisor, an expert assistant for Indian home gardeners.
Examine the supplied photo. Identify the most likely plant. If the photo is unclear or does not show a plant, say so honestly and do not guess.

Return ONLY valid JSON with exactly these keys:
{
  "plantName": "Common name (e.g. Tulsi / Holy Basil)",
  "scientificName": "Botanical Latin name (e.g. Ocimum tenuiflorum)",
  "confidence": "High, Medium, or Low",
  "description": "One or two sentences explaining the plant and common uses in Indian homes.",
  "sunlight": "Practical sunlight guidance (e.g. 4-6 hours direct sun)",
  "watering": "Practical watering guidance (e.g. Water when top inch of soil is dry)",
  "soil": "Practical soil/potting mix guidance (e.g. Well-draining red soil with vermicompost)",
  "careTips": ["Tip 1", "Tip 2", "Tip 3"],
  "caution": "Mention toxicity to pets, handling cautions, or state 'Safe for common home gardening' if none."
}

Do not claim certainty from an ambiguous image. Keep advice beginner-friendly and suitable for Indian balcony and terrace conditions.`

    // Models to try in order of preference
    const candidateModels = ['gemini-3.7-flash', 'gemini-3.8-flash', 'gemini-flash-latest']

    const ai = new GoogleGenAI({ apiKey })

    let lastError = null
    let responseText = ''

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: safeMimeType,
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        })

        responseText = response.text
        if (responseText) break
      } catch (err) {
        lastError = err
        console.warn(`Model ${model} attempt failed:`, err.message)
      }
    }

    if (!responseText) {
      // If SDK calls failed, attempt direct REST fallback with gemini-3.7-flash
      try {
        const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: safeMimeType, data: cleanBase64 } }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          }),
        })

        const payload = await upstream.json()
        if (upstream.ok) {
          responseText = payload?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('')
        } else {
          lastError = new Error(payload?.error?.message || 'Gemini API call failed')
        }
      } catch (fallbackErr) {
        lastError = fallbackErr
      }
    }

    if (!responseText) {
      return res.status(502).json({
        error: lastError?.message || 'The AI service could not analyse this photo. Please try again.',
      })
    }

    // Parse JSON
    let result
    try {
      const sanitized = responseText.replace(/^```json\s*|```$/g, '').trim()
      result = JSON.parse(sanitized)
    } catch {
      return res.status(500).json({
        error: 'Could not read the AI response format. Please try again with a clearer photo.',
      })
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
}

// @desc    Check Plant Advisor status
// @route   GET /api/identify-plant/status
// @access  Public
const getPlantAdvisorStatus = (req, res) => {
  const configured = Boolean(process.env.GEMINI_API_KEY)
  res.json({
    success: true,
    configured,
    model: 'gemini-3.7-flash',
    message: configured
      ? 'GreenRoots Plant Advisor AI is configured and ready'
      : 'GEMINI_API_KEY is not configured in Backend .env',
  })
}

module.exports = {
  identifyPlant,
  getPlantAdvisorStatus,
}
