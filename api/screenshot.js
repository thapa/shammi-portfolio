import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { projectId, url, type = 'desktop' } = req.body || {}
  if (!projectId || !url) return res.status(400).json({ error: 'Missing projectId or url' })

  const isMobile = type === 'mobile'
  const apiKey = process.env.SCREENSHOTBASE_API_KEY || process.env.VITE_SCREENSHOTBASE_API_KEY

  if (!apiKey) return res.status(500).json({ error: 'Missing SCREENSHOTBASE_API_KEY' })

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME
  const cloudApiKey = process.env.CLOUDINARY_API_KEY
  const cloudApiSecret = process.env.CLOUDINARY_API_SECRET
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName) return res.status(500).json({ error: 'Missing CLOUDINARY_CLOUD_NAME' })

  // ── 1. Fetch screenshot from ScreenshotBase ──────────────────────
  const params = new URLSearchParams({
    url,
    format: 'webp',
    viewport_width: isMobile ? '390' : '1280',
    viewport_height: isMobile ? '844' : '800',
    wait_until: 'load',
    delay: '2',
    block_cookie_banners: '1',
    block_ads: '1',
    block_chats: '1',
  })

  let imageBuffer
  try {
    const screenshotRes = await fetch(`https://api.screenshotbase.com/v1/take?${params}`, {
      headers: { apikey: apiKey },
    })
    if (!screenshotRes.ok) {
      const text = await screenshotRes.text()
      return res.status(500).json({ error: `ScreenshotBase error ${screenshotRes.status}: ${text}` })
    }
    const arrayBuffer = await screenshotRes.arrayBuffer()
    imageBuffer = Buffer.from(arrayBuffer)
  } catch (err) {
    return res.status(500).json({ error: `Screenshot fetch failed: ${err.message}` })
  }

  // ── 2. Upload screenshot buffer to Cloudinary ────────────────────
  let cloudinaryUrl
  try {
    const dataUri = `data:image/webp;base64,${imageBuffer.toString('base64')}`
    const folder = 'project-screenshots'
    const publicId = isMobile ? `${projectId}-mobile` : `${projectId}-desktop`
    const timestamp = Math.floor(Date.now() / 1000)

    const formData = new URLSearchParams()
    formData.append('file', dataUri)
    formData.append('folder', folder)
    formData.append('public_id', publicId)
    formData.append('overwrite', 'true')
    formData.append('timestamp', timestamp.toString())

    if (cloudApiKey && cloudApiSecret) {
      // Order of signed parameters alphabetically: folder=..., overwrite=..., public_id=..., timestamp=...
      const paramString = `folder=${folder}&overwrite=true&public_id=${publicId}&timestamp=${timestamp}${cloudApiSecret}`
      const signature = crypto.createHash('sha1').update(paramString).digest('hex')
      formData.append('api_key', cloudApiKey)
      formData.append('signature', signature)
    } else if (uploadPreset) {
      formData.append('upload_preset', uploadPreset)
    } else {
      return res.status(500).json({ error: 'Missing Cloudinary API keys or upload preset' })
    }

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const cloudText = await cloudRes.text()
    let cloudData = {}
    try { cloudData = cloudText ? JSON.parse(cloudText) : {} } catch { cloudData = { error: cloudText } }

    if (!cloudRes.ok) {
      return res.status(500).json({ error: `Cloudinary error: ${cloudData.error?.message || cloudData.error || 'Upload failed'}` })
    }

    cloudinaryUrl = cloudData.secure_url || cloudData.url
  } catch (err) {
    return res.status(500).json({ error: `Cloudinary upload exception: ${err.message}` })
  }

  // ── 3. Save Cloudinary URL back to projects table ───────────────
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  )

  const dbField = isMobile ? 'mobile_screenshot_url' : 'screenshot_url'

  const { error: dbError } = await supabase
    .from('projects')
    .update({ [dbField]: cloudinaryUrl })
    .eq('id', projectId)

  if (dbError) return res.status(500).json({ error: `DB update failed: ${dbError.message}` })

  res.json({ url: cloudinaryUrl })
}
