import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

    if (!cloudName) {
      return res.status(500).json({ error: 'Missing CLOUDINARY_CLOUD_NAME in environment variables' })
    }

    let file, resourceType = 'auto', folder = 'project-screenshots', targetType = 'desktop'

    // Handle JSON body with base64/Data URI or text payload
    if (req.headers['content-type']?.includes('application/json')) {
      const body = req.body || {}
      file = body.file
      if (body.resourceType) resourceType = body.resourceType
      if (body.folder) folder = body.folder
      if (body.targetType) targetType = body.targetType
    } else {
      const body = typeof req.body === 'string' ? (req.body ? JSON.parse(req.body) : {}) : (req.body || {})
      file = body?.file
      if (body?.resourceType) resourceType = body.resourceType
      if (body?.folder) folder = body.folder
      if (body?.targetType) targetType = body.targetType
    }

    if (!file) {
      return res.status(400).json({ error: 'Missing file payload' })
    }

    // Mobile screenshots MUST be images only
    if (targetType === 'mobile' || resourceType === 'mobile') {
      if (typeof file === 'string' && (file.startsWith('data:video/') || file.includes('.mp4') || file.includes('.webm'))) {
        return res.status(400).json({ error: 'Mobile screenshot must be an image only' })
      }
      resourceType = 'image'
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType === 'video' ? 'video' : resourceType === 'image' ? 'image' : 'auto'}/upload`

    const formData = new URLSearchParams()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('timestamp', timestamp.toString())

    if (apiKey && apiSecret) {
      const paramString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
      const signature = crypto.createHash('sha1').update(paramString).digest('hex')
      formData.append('api_key', apiKey)
      formData.append('signature', signature)
    } else if (uploadPreset) {
      formData.append('upload_preset', uploadPreset)
    } else {
      return res.status(500).json({
        error: 'Missing Cloudinary authentication. Provide CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET or CLOUDINARY_UPLOAD_PRESET',
      })
    }

    const cloudRes = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })

    const cloudText = await cloudRes.text()
    let cloudData = {}
    try { cloudData = cloudText ? JSON.parse(cloudText) : {} } catch { cloudData = { error: cloudText } }

    if (!cloudRes.ok) {
      return res.status(cloudRes.status).json({
        error: cloudData.error?.message || cloudData.error || 'Cloudinary upload failed',
      })
    }

    return res.status(200).json({
      url: cloudData.secure_url || cloudData.url,
      resourceType: cloudData.resource_type,
      publicId: cloudData.public_id,
      format: cloudData.format,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error during upload' })
  }
}
