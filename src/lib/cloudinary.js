/**
 * Check if a given URL is a video.
 * Supports Cloudinary video resource URLs (/video/upload/)
 * as well as standard video file extensions (.mp4, .webm, .mov, etc.).
 *
 * @param {string | null | undefined} url
 * @returns {boolean}
 */
export function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false

  const cleanUrl = url.split('?')[0].toLowerCase()

  // Cloudinary video URL path pattern
  if (cleanUrl.includes('/video/upload/')) return true

  // Common video extensions
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.m4v', '.avi', '.m3u8']
  return videoExtensions.some(ext => cleanUrl.endsWith(ext))
}

/**
 * Helper to build optimized Cloudinary URLs if the URL is a Cloudinary upload link.
 * Adds auto format and quality optimizations (f_auto, q_auto) by default.
 *
 * @param {string} url
 * @param {object} [options]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.crop]
 * @returns {string}
 */
export function getCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url
  }

  const { width, height, crop = 'limit' } = options
  const parts = []

  parts.push('f_auto')
  parts.push('q_auto')

  if (width || height) {
    let resize = `c_${crop}`
    if (width) resize += `,w_${width}`
    if (height) resize += `,h_${height}`
    parts.push(resize)
  }

  const transformStr = parts.join(',')
  return url.replace(/\/upload\/(v\d+\/)?/, `/upload/${transformStr}/$1`)
}

/**
 * Safely parse JSON response from fetch requests to avoid "Unexpected end of JSON input".
 *
 * @param {Response} res
 * @returns {Promise<any>}
 */
export async function safeParseResponse(res) {
  const text = await res.text()
  if (!text || !text.trim()) return {}
  try {
    return JSON.parse(text)
  } catch (e) {
    return { error: text || `Server returned invalid response (${res.status})` }
  }
}

/**
 * Client-side helper to upload a File or Blob directly to Cloudinary's upload API.
 * Uses an unsigned upload preset so it works from both localhost and production
 * without needing a serverless proxy, and bypasses Vercel's 4.5MB payload limit.
 *
 * @param {File | Blob} file
 * @param {object} [options]
 * @param {string} [options.targetType='desktop']
 * @param {string} [options.folder='project-screenshots']
 * @returns {Promise<string>} secure URL of uploaded media
 */
export async function uploadToCloudinary(file, options = {}) {
  if (!file) return null

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set. Add it to your .env file.')
  }
  if (!uploadPreset) {
    throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not set. Add it to your .env file.')
  }

  const isVideo = file.type.startsWith('video/')
  const resourceType = isVideo ? 'video' : 'image'
  const folder = options.folder || 'project-screenshots'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  const data = await safeParseResponse(res)
  if (!res.ok) {
    throw new Error(data.error?.message || data.error || `Upload failed with status ${res.status}`)
  }

  return data.secure_url || data.url
}

/**
 * Opens Cloudinary Upload Widget popup directly in the browser.
 * Bypasses Vercel serverless body size limits completely (supports up to 100MB+ files).
 * Allows choosing existing files from Cloudinary media library or uploading new files.
 */
export function openCloudinaryWidget({
  cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  targetType = 'desktop', // 'desktop' or 'mobile'
  folder = 'project-screenshots',
  onSuccess,
  onError,
}) {
  if (typeof window === 'undefined') return

  if (!window.cloudinary) {
    const err = new Error('Cloudinary upload widget script is still loading. Please try again in 3 seconds.')
    if (onError) onError(err)
    else alert(err.message)
    return
  }

  const isMobile = targetType === 'mobile'

  const options = {
    cloudName: cloudName || undefined,
    uploadPreset: uploadPreset || undefined,
    sources: ['local', 'url', 'camera', 'dropbox', 'image_search'],
    multiple: false,
    folder: folder,
    resourceType: isMobile ? 'image' : 'auto',
    clientAllowedFormats: isMobile
      ? ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']
      : ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'mp4', 'webm', 'mov', 'm4v', 'avi'],
    maxFileSize: 100000000, // 100MB direct upload
    maxVideoFileSize: 100000000,
    styles: {
      palette: {
        window: '#FFFFFF',
        windowBorder: '#CBD5E1',
        tabIcon: '#7C3AED',
        menuBg: '#F8FAFC',
        link: '#7C3AED',
        action: '#7C3AED',
        activeTab: '#7C3AED',
        inProgress: '#2563EB',
        complete: '#16A34A',
        error: '#DC2626',
        textDark: '#0F172A',
        textLight: '#FFFFFF',
      },
    },
  }

  // Prompt user if cloudName isn't set in env
  if (!options.cloudName) {
    const userCloud = prompt('Cloudinary Cloud Name is required for widget. Please enter your Cloud Name:')
    if (!userCloud) return
    options.cloudName = userCloud
  }

  try {
    const widget = window.cloudinary.createUploadWidget(options, (error, result) => {
      if (error) {
        if (onError) onError(error)
        return
      }
      if (result && result.event === 'success') {
        const secureUrl = result.info.secure_url || result.info.url
        if (onSuccess) onSuccess(secureUrl, result.info)
      }
    })

    widget.open()
  } catch (err) {
    if (onError) onError(err)
    else alert(`Widget Error: ${err.message || err}`)
  }
}
