import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { HiExternalLink, HiX } from 'react-icons/hi'
import { useContent } from '../../../context/ContentContext'
import { getOrFetchScreenshot, getOrFetchMobileScreenshot } from '../../../lib/screenshotbase'
import { gsap, ScrollTrigger, SplitText } from '../../../lib/gsap'

const tabs = ['All', 'WordPress', 'Shopify']

// ─── Screenshot image with loading + fallback ──────────────────────────────
const ScreenshotImage = ({ src, loading, error, fallbackTitle, className = '', objectPosition = 'top' }) => (
  <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${className}`}>
    {/* Neutral fallback — always underneath */}
    <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-end p-4">
      <span className="text-neutral-400 dark:text-neutral-600 font-display font-bold text-2xl leading-none select-none">
        {fallbackTitle}
      </span>
    </div>
    {/* Screenshot fades in once loaded */}
    {!error && (
      <img
        src={src ?? undefined}
        alt={fallbackTitle}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${src && !loading ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectPosition }}
      />
    )}
    {/* Shimmer while loading */}
    {loading && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
    )}
  </div>
)

// ─── Project modal ─────────────────────────────────────────────────────────
const ProjectModal = ({ project: p, onClose }) => {
  const [desktopSrc, setDesktopSrc] = useState(null)
  const [desktopLoading, setDesktopLoading] = useState(true)
  const [desktopError, setDesktopError] = useState(false)

  const [mobileSrc, setMobileSrc] = useState(null)
  const [mobileLoading, setMobileLoading] = useState(true)
  const [mobileError, setMobileError] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Fetch desktop screenshot
  useEffect(() => {
    let cancelled = false
    getOrFetchScreenshot(p)
      .then((src) => { if (!cancelled) { setDesktopSrc(src); setDesktopLoading(false) } })
      .catch(() => { if (!cancelled) { setDesktopError(true); setDesktopLoading(false) } })
    return () => { cancelled = true }
  }, [p.id])

  // Fetch mobile screenshot
  useEffect(() => {
    let cancelled = false
    getOrFetchMobileScreenshot(p)
      .then((src) => { if (!cancelled) { setMobileSrc(src); setMobileLoading(false) } })
      .catch(() => { if (!cancelled) { setMobileError(true); setMobileLoading(false) } })
    return () => { cancelled = true }
  }, [p.id])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 md:p-8 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">
              {p.category}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
              {p.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors flex-shrink-0 mt-1"
            aria-label="Close"
          >
            <HiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex flex-col gap-8">
          {/* Description */}
          <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
            {p.description}
          </p>

          {/* Tech Stack */}
          {p.tech_stack?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium px-3 py-1.5 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">
              Screenshots
            </p>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-4 items-start">
              {/* Desktop */}
              <div>
                <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-2 font-medium">Desktop</p>
                <ScreenshotImage
                  src={desktopSrc}
                  loading={desktopLoading}
                  error={desktopError}
                  fallbackTitle={p.title}
                  className="w-full aspect-video rounded-xl border border-neutral-100 dark:border-neutral-800"
                  objectPosition="top"
                />
              </div>
              {/* Mobile */}
              <div>
                <p className="text-xs text-neutral-400 dark:text-neutral-600 mb-2 font-medium">Mobile</p>
                <div className="relative mx-auto w-[140px] md:w-full">
                  {/* Phone frame */}
                  <div className="absolute inset-0 rounded-[2rem] border-[6px] border-neutral-900 dark:border-neutral-700 z-10 pointer-events-none shadow-xl" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-neutral-900 dark:bg-neutral-700 rounded-b-xl z-20 pointer-events-none" />
                  <ScreenshotImage
                    src={mobileSrc}
                    loading={mobileLoading}
                    error={mobileError}
            
                    fallbackTitle=""
                    className="rounded-[1.6rem] overflow-hidden aspect-[9/19]"
                    objectPosition="top"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer action */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-[#0E0E0E] text-sm font-bold px-6 py-3 rounded-full hover:bg-primary-light transition-colors"
            >
              Visit Live Site <HiExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Project card ──────────────────────────────────────────────────────────
const ProjectCard = ({ project: p, onClick }) => {
  const [imgSrc, setImgSrc] = useState(null)
  const [imgLoading, setImgLoading] = useState(true)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    let cancelled = false
    getOrFetchScreenshot(p)
      .then((src) => { if (!cancelled) { setImgSrc(src); setImgLoading(false) } })
      .catch(() => { if (!cancelled) { setImgError(true); setImgLoading(false) } })
    return () => { cancelled = true }
  }, [p.id])

  return (
    <button
      onClick={onClick}
      data-cursor="view"
      className="group text-left rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-lg dark:hover:shadow-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary w-full"
    >
      {/* 3:2 preview */}
      <ScreenshotImage
        src={imgSrc}
        loading={imgLoading}
        error={imgError}

        fallbackTitle={p.title}
        className="aspect-[3/2] w-full"
        objectPosition="top"
      />

      {/* Info */}
      <div className="p-5 bg-white dark:bg-neutral-900 transition-colors">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
          {p.category}
        </span>
        <h3 className="font-semibold text-neutral-900 dark:text-white mt-1 mb-1 group-hover:text-primary transition-colors">
          {p.title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 line-clamp-2 leading-relaxed">
          {p.description}
        </p>
      </div>
    </button>
  )
}

// ─── Skeletons ─────────────────────────────────────────────────────────────
const ProjectSkeleton = () => (
  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
        <div className="aspect-[3/2] bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="p-5 bg-white dark:bg-neutral-900">
          <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
          <div className="h-5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
          <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
)

// ─── Section ───────────────────────────────────────────────────────────────
const Projects = () => {
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)
  const { projects, loading } = useContent()

  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const headingRef = useRef(null)
  const gridRef = useRef(null)

  const filtered =
    active === 'All' ? projects : projects.filter((p) => p.category === active)

  const handleClose = useCallback(() => setSelected(null), [])

  // Heading + tabs
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { start: 'top 82%', once: true }

      gsap.from(labelRef.current, {
        y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: labelRef.current, ...st },
      })

      const split = new SplitText(headingRef.current, { type: 'words' })
      gsap.from(split.words, {
        y: 48, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, ...st },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Cards — animate when data is ready (grid already in view)
  useEffect(() => {
    if (loading || !gridRef.current) return

    const cards = Array.from(gridRef.current.children)
    if (!cards.length) return

    gsap.fromTo(
      cards,
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
    )

    return () => gsap.killTweensOf(cards)
  }, [loading])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="bg-white dark:bg-[#0E0E0E] py-24 md:py-32 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p ref={labelRef} className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">
              Portfolio
            </p>
            <h2
              ref={headingRef}
              className="font-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-tight"
            >
              Showcasing My Most
              <br />
              Recent Projects
            </h2>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  active === tab
                    ? 'bg-primary text-[#0E0E0E]'
                    : 'border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <ProjectSkeleton />
        ) : (
          <div ref={gridRef} className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => setSelected(p)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={handleClose} />
      )}
    </section>
  )
}

export default Projects
