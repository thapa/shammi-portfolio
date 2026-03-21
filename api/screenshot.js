import { createClient } from '@supabase/supabase-js'

const BUCKET = 'project-screenshots'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { projectId, url, type = 'desktop' } = req.body
  if (!projectId || !url) return res.status(400).json({ error: 'Missing projectId or url' })

  const isMobile = type === 'mobile'
  const apiKey = process.env.SCREENSHOTBASE_API_KEY || process.env.VITE_SCREENSHOTBASE_API_KEY

  if (!apiKey) return res.status(500).json({ error: 'Missing SCREENSHOTBASE_API_KEY' })

  // ── 1. Fetch screenshot from ScreenshotBase ──────────────────────
  const params = new URLSearchParams({
    url,
    format: 'webp',
    viewport_width: isMobile ? '390' : '1280',
    viewport_height: isMobile ? '844' : '800',
    wait_until: 'networkidle2',
    delay: '3',
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

  // ── 2. Upload to Supabase Storage ────────────────────────────────
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  )

  const fileName = isMobile ? `${projectId}-mobile.webp` : `${projectId}.webp`
  const dbField = isMobile ? 'mobile_screenshot_url' : 'screenshot_url'

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, imageBuffer, { contentType: 'image/webp', upsert: true })

  if (uploadError) return res.status(500).json({ error: `Storage upload failed: ${uploadError.message}` })

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName)

  // ── 3. Save URL back to projects table ───────────────────────────
  const { error: dbError } = await supabase
    .from('projects')
    .update({ [dbField]: publicUrl })
    .eq('id', projectId)

  if (dbError) return res.status(500).json({ error: `DB update failed: ${dbError.message}` })

  res.json({ url: publicUrl })
}
