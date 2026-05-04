import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { HiExternalLink, HiX, HiArrowRight } from 'react-icons/hi'
import { useContent } from '../../../context/ContentContext'
import { getOrFetchScreenshot, getOrFetchMobileScreenshot } from '../../../lib/screenshotbase'
import { gsap, ScrollTrigger, SplitText } from '../../../lib/gsap'

const tabs = ['All', 'WordPress', 'Shopify']

// ─── Screenshot image with loading + fallback ──────────────────────────────
const ScreenshotImage = ({ src, loading, error, fallbackTitle, className = '', objectPosition = 'top' }) => (
  <div className={`relative overflow-hidden ${className}`} style={{ background: 'var(--ds-bg-elevated)' }}>
    <div className="absolute inset-0 flex items-end p-4">
      <span className="font-display text-2xl leading-none select-none" style={{ color: 'var(--ds-text-3)', opacity: 0.3 }}>
        {fallbackTitle}
      </span>
    </div>
    {!error && (
      <img
        src={src ?? undefined}
        alt={fallbackTitle}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${src && !loading ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectPosition }}
      />
    )}
    {loading && (
      <div className="absolute inset-0 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
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

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    let cancelled = false
    getOrFetchScreenshot(p)
      .then((src) => { if (!cancelled) { setDesktopSrc(src); setDesktopLoading(false) } })
      .catch(() => { if (!cancelled) { setDesktopError(true); setDesktopLoading(false) } })
    return () => { cancelled = true }
  }, [p.id])

  useEffect(() => {
    let cancelled = false
    getOrFetchMobileScreenshot(p)
      .then((src) => { if (!cancelled) { setMobileSrc(src); setMobileLoading(false) } })
      .catch(() => { if (!cancelled) { setMobileError(true); setMobileLoading(false) } })
    return () => { cancelled = true }
  }, [p.id])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'oklch(9% 0.008 220 / 0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--ds-bg-surface)',
          border: '1px solid var(--ds-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 md:p-8" style={{ borderBottom: '1px solid var(--ds-border)' }}>
          <div>
            <span
              className="inline-block text-[10px] font-medium uppercase tracking-widest px-2.5 py-1 mb-3"
              style={{ color: 'var(--ds-accent)', border: '1px solid var(--ds-border)' }}
            >
              {p.category}
            </span>
            <h2 className="section-heading">
              {p.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center flex-shrink-0 mt-1 transition-colors"
            style={{ border: '1px solid var(--ds-border)', color: 'var(--ds-text-3)' }}
            aria-label="Close"
          >
            <HiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex flex-col gap-8">
          <p className="body-text">
            {p.description}
          </p>

          {p.tech_stack?.length > 0 && (
            <div>
              <p className="section-label mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {p.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-sm font-medium px-3 py-1.5"
                    style={{ border: '1px solid var(--ds-border)', color: 'var(--ds-text-2)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="section-label mb-4">Screenshots</p>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-4 items-start">
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--ds-text-3)' }}>Desktop</p>
                <ScreenshotImage
                  src={desktopSrc}
                  loading={desktopLoading}
                  error={desktopError}
                  fallbackTitle={p.title}
                  className="w-full aspect-video"
                  objectPosition="top"
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--ds-text-3)' }}>Mobile</p>
                <div className="relative mx-auto w-[140px] md:w-full">
                  <ScreenshotImage
                    src={mobileSrc}
                    loading={mobileLoading}
                    error={mobileError}
                    fallbackTitle=""
                    className="overflow-hidden aspect-[9/19]"
                    objectPosition="top"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3" style={{ borderTop: '1px solid var(--ds-border)' }}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Visit Live Site <HiExternalLink size={15} />
            </a>
            <Link
              to={`/project/${p.id}`}
              className="inline-flex items-center gap-2 px-7 py-[14px] text-xs font-display uppercase tracking-[0.06em] transition-colors"
              style={{
                border: '1px solid var(--ds-border)',
                color: 'var(--ds-text-2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--ds-accent)'
                e.currentTarget.style.color = 'var(--ds-accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--ds-border)'
                e.currentTarget.style.color = 'var(--ds-text-2)'
              }}
            >
              Case Study <HiArrowRight size={14} />
            </Link>
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
    if (p.thumbnail_url) {
      setImgSrc(p.thumbnail_url)
      setImgLoading(false)
      return
    }
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
      className="group relative flex flex-col md:flex-row text-left overflow-hidden transition-all duration-300 ease-out cursor-pointer focus:outline-none w-full"
      style={{
        background: 'var(--ds-bg-surface)',
        border: '1px solid var(--ds-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ds-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--ds-border)'
      }}
    >
      {/* Left Info Area */}
      <div
        className="w-full md:w-[60%] p-4 md:p-8 lg:p-8 flex flex-col justify-between relative z-10"
        style={{ borderRight: '1px solid var(--ds-border)' }}
      >
        <div>
          {/* Category Badge */}
          <span
            className="text-[0.65rem] font-bold tracking-[0.15em] uppercase px-3 py-1.5 mb-4 md:mb-8 inline-block"
            style={{ color: 'var(--ds-accent)', border: '1px solid var(--ds-border)', background: 'var(--ds-bg)' }}
          >
            {p.category}
          </span>

          {/* Title */}
          <h3
            className="font-display text-2xl sm:text-3xl lg:text-[2rem] uppercase tracking-tighter mb-0 md:mb-8 leading-none"
            style={{ color: 'var(--ds-text-1)' }}
          >
            {p.title}
          </h3>

          {/* Divider */}
          <div className="hidden md:block w-full h-px mb-8 transition-colors duration-300 group-hover:bg-[var(--ds-accent)]" style={{ background: 'var(--ds-border)' }} />

          {/* Description */}
          <p className="hidden md:block text-sm md:text-base leading-relaxed mb-12 max-w-lg" style={{ color: 'var(--ds-text-2)' }}>
            {p.description}
          </p>
        </div>

        {/* Tech Stack */}
        {p.tech_stack?.length > 0 && (
          <div className="hidden md:block mt-auto">
            <p className="text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-4" style={{ color: 'var(--ds-accent)' }}>
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {p.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5"
                  style={{ border: '1px solid var(--ds-border)', color: 'var(--ds-text-2)', background: 'var(--ds-bg)' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Image Area */}
      <div className="w-full md:w-[40%] relative h-[220px] md:h-auto md:min-h-0 overflow-hidden" style={{ background: 'var(--ds-bg-elevated)' }}>
        <div className="absolute inset-0 flex items-center justify-center p-8 z-0">
          <span className="font-display text-4xl md:text-6xl leading-none select-none text-center" style={{ color: 'var(--ds-text-3)', opacity: 0.1 }}>
            {p.title}
          </span>
        </div>

        {!imgError && (
          <img
            src={imgSrc ?? undefined}
            alt={p.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${imgSrc && !imgLoading ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {imgLoading && (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
        )}

        {/* Subtle Hover Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" style={{ background: 'var(--ds-accent)' }} />
      </div>
    </button>
  )
}

// ─── Skeletons ─────────────────────────────────────────────────────────────
const ProjectSkeleton = () => (
  <div className="flex flex-col gap-10">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex flex-col md:flex-row overflow-hidden min-h-[400px]" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-surface)' }}>
        {/* Left Side Skeleton */}
        <div className="w-full md:w-[60%] p-8 md:p-12 lg:p-16 flex flex-col justify-between" style={{ borderRight: '1px solid var(--ds-border)' }}>
          <div>
            <div className="h-6 w-24 animate-pulse mb-8" style={{ background: 'var(--ds-bg-elevated)' }} />
            <div className="h-10 w-3/4 animate-pulse mb-4" style={{ background: 'var(--ds-bg-elevated)' }} />
            <div className="h-10 w-1/2 animate-pulse mb-8" style={{ background: 'var(--ds-bg-elevated)' }} />
            <div className="w-full h-px mb-8 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
            <div className="h-4 w-full animate-pulse mb-3" style={{ background: 'var(--ds-bg-elevated)' }} />
            <div className="h-4 w-5/6 animate-pulse mb-3" style={{ background: 'var(--ds-bg-elevated)' }} />
            <div className="h-4 w-4/6 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
          </div>
          <div className="mt-12">
            <div className="h-3 w-20 animate-pulse mb-4" style={{ background: 'var(--ds-bg-elevated)' }} />
            <div className="flex gap-2">
              <div className="h-8 w-16 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
              <div className="h-8 w-20 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
              <div className="h-8 w-24 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
            </div>
          </div>
        </div>
        {/* Right Side Skeleton */}
        <div className="w-full md:w-[40%] animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
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

  useEffect(() => {
    if (loading || !gridRef.current) return

    const cards = Array.from(gridRef.current.children)
    if (!cards.length) return

    gsap.fromTo(
      cards,
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
    )

    return () => gsap.killTweensOf(cards)
  }, [loading, active]) // Also re-trigger animation when category tab changes!

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden py-24 md:py-32 transition-colors duration-300"
      style={{ background: 'var(--ds-bg)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <p ref={labelRef} className="section-label mb-4" style={{ color: 'var(--ds-accent)' }}>
              Portfolio
            </p>
            <h2 ref={headingRef} className="section-heading">
              Selected work
            </h2>
          </div>

          {/* Filter tabs — no rounded pills, flat, architectural */}
          <div className="flex flex-shrink-0 gap-0" style={{ border: '1px solid var(--ds-border)' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                aria-pressed={active === tab}
                className="px-5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: active === tab ? 'var(--ds-accent)' : 'transparent',
                  color: active === tab ? 'var(--ds-bg)' : 'var(--ds-text-3)',
                  borderRight: tab !== tabs[tabs.length - 1] ? '1px solid var(--ds-border)' : 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <ProjectSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm" style={{ color: 'var(--ds-text-3)' }}>No projects in this category yet.</p>
          </div>
        ) : (
          <div ref={gridRef} className="flex flex-col gap-10">
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
