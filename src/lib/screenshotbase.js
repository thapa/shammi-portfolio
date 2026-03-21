import { supabase } from './supabase'

const API_KEY = import.meta.env.VITE_SCREENSHOTBASE_API_KEY
const ENDPOINT = 'https://api.screenshotbase.com/v1/take'
const BUCKET = 'project-screenshots'

// In-memory caches
const desktopCache = new Map()
const mobileCache = new Map()
const inFlight = new Map()

const fetchFromAPI = async (siteUrl, isMobile = false) => {
  const params = new URLSearchParams({
    url: siteUrl,
    format: 'webp',
    viewport_width: isMobile ? '390' : '1280',
    viewport_height: isMobile ? '844' : '800',
    // Wait until network is fully idle — fixes lazy-loaded images showing as white
    wait_until: 'networkidle2',
    // Extra buffer for JS-driven lazy loads after network settles
    delay: '3',
    block_cookie_banners: '1',
    block_ads: '1',
    block_chats: '1',
  })

  const response = await fetch(`${ENDPOINT}?${params}`, {
    headers: { apikey: API_KEY },
  })

  if (!response.ok) throw new Error(`ScreenshotBase error: ${response.status}`)
  return response.blob()
}

const uploadAndSave = async (projectId, blob, fileName, dbField) => {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, blob, { contentType: 'image/webp', upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName)

  await supabase
    .from('projects')
    .update({ [dbField]: publicUrl })
    .eq('id', projectId)

  return publicUrl
}

export const getOrFetchScreenshot = async (project) => {
  if (project.screenshot_url) {
    desktopCache.set(project.id, project.screenshot_url)
    return project.screenshot_url
  }
  if (desktopCache.has(project.id)) return desktopCache.get(project.id)

  const key = `desktop_${project.id}`
  if (inFlight.has(key)) return inFlight.get(key)

  const promise = (async () => {
    try {
      const blob = await fetchFromAPI(project.url, false)
      const url = await uploadAndSave(project.id, blob, `${project.id}.webp`, 'screenshot_url')
      desktopCache.set(project.id, url)
      return url
    } finally {
      inFlight.delete(key)
    }
  })()

  inFlight.set(key, promise)
  return promise
}

export const getOrFetchMobileScreenshot = async (project) => {
  if (project.mobile_screenshot_url) {
    mobileCache.set(project.id, project.mobile_screenshot_url)
    return project.mobile_screenshot_url
  }
  if (mobileCache.has(project.id)) return mobileCache.get(project.id)

  const key = `mobile_${project.id}`
  if (inFlight.has(key)) return inFlight.get(key)

  const promise = (async () => {
    try {
      const blob = await fetchFromAPI(project.url, true)
      const url = await uploadAndSave(project.id, blob, `${project.id}-mobile.webp`, 'mobile_screenshot_url')
      mobileCache.set(project.id, url)
      return url
    } finally {
      inFlight.delete(key)
    }
  })()

  inFlight.set(key, promise)
  return promise
}
