// In-memory caches — persist for the browser session
const desktopCache = new Map()
const mobileCache = new Map()
const inFlight = new Map()

// Call our Vercel serverless function (avoids CORS + keeps API key server-side)
const fetchViaServer = async (projectId, url, type) => {
  const res = await fetch('/api/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, url, type }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Screenshot API error ${res.status}`)
  }
  const data = await res.json()
  return data.url
}

export const getOrFetchScreenshot = async (project) => {
  // Already have a saved URL → use it
  if (project.screenshot_url) {
    desktopCache.set(project.id, project.screenshot_url)
    return project.screenshot_url
  }

  // Session cache hit
  if (desktopCache.has(project.id)) return desktopCache.get(project.id)

  // Deduplicate concurrent calls for the same project
  const key = `desktop_${project.id}`
  if (inFlight.has(key)) return inFlight.get(key)

  const promise = (async () => {
    try {
      const url = await fetchViaServer(project.id, project.url, 'desktop')
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
      const url = await fetchViaServer(project.id, project.url, 'mobile')
      mobileCache.set(project.id, url)
      return url
    } finally {
      inFlight.delete(key)
    }
  })()

  inFlight.set(key, promise)
  return promise
}
