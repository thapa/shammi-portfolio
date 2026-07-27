import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowRight, HiArrowUpRight } from 'react-icons/hi2'
import { isVideoUrl } from '../lib/cloudinary'
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap'
import { Safari } from '../components/ui/safari'
import { Iphone } from '../components/ui/iphone'

// ── Inline highlight ─────────────────────────────────────────────────────────
const Hl = ({ children }) => (
  <mark style={{
    background: 'color-mix(in srgb, var(--ds-accent) 20%, transparent)',
    color: 'inherit',
    padding: '0 3px',
    borderRadius: 0,
  }}>
    {children}
  </mark>
)

// ── Text with inline highlights ──────────────────────────────────────────────
const RichText = ({ parts, className }) => (
  <p className={className}>
    {parts.map((part, i) =>
      typeof part === 'string' ? part : <Hl key={i}>{part.hl}</Hl>
    )}
  </p>
)

// ── Placeholder panel ────────────────────────────────────────────────────────
const Placeholder = ({ label }) => (
  <div style={{ background: 'var(--ds-bg-elevated)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
    <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
      <rect x="1" y="1" width="42" height="34" rx="2" stroke="oklch(38% 0.005 220)" strokeWidth="1.4" />
      <circle cx="14" cy="14" r="4" stroke="oklch(38% 0.005 220)" strokeWidth="1.4" />
      <path d="M1 26L13 16L20 22L30 14L43 26" stroke="oklch(38% 0.005 220)" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    <p style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'oklch(48% 0.006 220)', fontFamily: '"Michroma", sans-serif' }}>
      {label}
    </p>
  </div>
)

// ── Web Case Study — dynamic ──────────────────────────────────────────────────
const CaseStudyWeb = ({ project }) => {
  const titleRef     = useRef(null)
  const previewRef   = useRef(null)
  const narrativeRef = useRef(null)
  const stackRef     = useRef(null)
  const resultsRef   = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: 'words' })
        gsap.from(split.words, { y: 48, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out', delay: 0.15 })
      }
      if (previewRef.current) {
        gsap.from(Array.from(previewRef.current.children), {
          y: 32, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: previewRef.current, start: 'top 82%', once: true },
        })
      }
      if (narrativeRef.current) {
        gsap.from(Array.from(narrativeRef.current.children), {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: narrativeRef.current, start: 'top 82%', once: true },
        })
      }
      if (stackRef.current) {
        gsap.from(Array.from(stackRef.current.children), {
          y: 16, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: stackRef.current, start: 'top 82%', once: true },
        })
      }
      if (resultsRef.current) {
        gsap.from(resultsRef.current.querySelectorAll('.cs-r'), {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: resultsRef.current, start: 'top 75%', once: true },
        })
      }
    })
    return () => ctx.revert()
  }, [])

  // ── Derive template data from project prop ──────────────────────────────────
  let liveSiteHost = ''
  try { liveSiteHost = new URL(project.url).hostname } catch {}

  const hasNarrative   = project.challenge || project.approach
  const hasTechStack   = (project.tech_stack || []).length > 0
  const hasTestimonial = project.testimonial_quote
  const hasResults     = project.results_headline || project.outcome
  const resultMetrics  = project.metrics || []

  const meta = [
    { label: 'Client',      value: project.client_name || project.title },
    { label: 'Engagement',  value: 'Web Design & Development' },
    { label: 'Timeline',    value: project.timeline || '—' },
    { label: 'Live Site',   value: liveSiteHost || project.url, href: project.url },
  ]

  return (
    <div style={{ background: 'var(--ds-bg)', paddingTop: '120px' }}>

      {/* ── Top meta bar ──────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--ds-border)', borderTop: '1px solid var(--ds-border)' }}>
        <div
          className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4"
          style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)' }}
        >
          {meta.map((item, i) => (
            <div
              key={i}
              className="py-4 px-4 md:px-6"
              style={{ borderRight: i < 3 ? '1px solid var(--ds-border)' : 'none' }}
            >
              <p className="section-label mb-1.5">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium"
                  style={{ color: 'var(--ds-accent)', transition: 'opacity 160ms ease-out' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {item.value}
                  <HiArrowUpRight size={12} />
                </a>
              ) : (
                <p className="text-sm font-medium" style={{ color: 'var(--ds-text-1)' }}>{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--ds-bg-surface)', borderBottom: '1px solid var(--ds-border)' }}>
        <div
          className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-14 flex items-end justify-between gap-6"
          style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)' }}
        >
          <h1
            ref={titleRef}
            className="font-display uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--ds-text-1)' }}
          >
            {project.title}
          </h1>

          <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0 pb-1">
            {(project.role || 'Design & Development') && (
              <p className="section-label">
                Role&nbsp;&nbsp;<span style={{ color: 'var(--ds-text-2)' }}>{project.role || 'Design & Development'}</span>
              </p>
            )}
            {project.duration && (
              <p className="section-label">
                Duration&nbsp;&nbsp;<span style={{ color: 'var(--ds-text-2)' }}>{project.duration}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Website preview ──────────────────────────────────────────────── */}
      <div
        className="max-w-[1200px] mx-auto px-6 md:px-10 pt-10 pb-0"
        style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)' }}
      >
        <p
          className="mb-5"
          style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ds-accent)' }}
        >
          ● Live site preview
        </p>
        <div ref={previewRef} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-stretch">
          <Safari
            url={project.url}
            {...(isVideoUrl(project.screenshot_url)
              ? { videoSrc: project.screenshot_url }
              : { imageSrc: project.screenshot_url })}
            className="w-full"
          />
          <div className="flex justify-center md:justify-end">
            <Iphone
              src={project.mobile_screenshot_url}
              style={{ height: '100%', width: 'auto' }}
            />
          </div>
        </div>
      </div>

      {/* ── Challenge + Approach ──────────────────────────────────────────── */}
      {hasNarrative && (
        <div className="pt-16 md:pt-24 pb-12 md:pb-16" style={{ borderTop: '1px solid var(--ds-border)', marginTop: '3rem' }}>
          <div
            ref={narrativeRef}
            className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
            style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)' }}
          >
            {project.challenge && (
              <div>
                <p className="font-display uppercase mb-5" style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', color: 'var(--ds-text-1)' }}>
                  The Challenge
                </p>
                <RichText parts={[project.challenge]} className="body-text" />
              </div>
            )}
            {project.approach && (
              <div>
                <p className="font-display uppercase mb-5" style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', color: 'var(--ds-text-1)' }}>
                  The Approach
                </p>
                <RichText parts={[project.approach]} className="body-text" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      {hasTechStack && (
        <div style={{ borderTop: '1px solid var(--ds-border)', borderBottom: '1px solid var(--ds-border)' }}>
          <div
            className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-10"
            style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)' }}
          >
            <p className="section-label mb-5">Built With</p>
            <div ref={stackRef} className="flex flex-wrap gap-2">
              {project.tech_stack.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: '"Michroma", sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--ds-text-2)',
                    background: 'var(--ds-bg-elevated)',
                    border: '1px solid var(--ds-border)',
                    padding: '6px 12px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Testimonial ───────────────────────────────────────────────────── */}
      {hasTestimonial && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div
            className="p-8 md:p-14 flex flex-col md:flex-row gap-6 md:gap-10"
            style={{ background: 'var(--ds-bg-surface)', border: '1px solid var(--ds-border)' }}
          >
            <div className="flex-shrink-0 pt-1">
              <span className="font-display leading-none" style={{ fontSize: '4rem', color: 'var(--ds-accent)' }}>"</span>
            </div>
            <div className="flex flex-col gap-8 md:gap-10 pt-2">
              <p className="italic" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: 'var(--ds-text-1)', lineHeight: 1.4 }}>
                {project.testimonial_quote}
              </p>
              <p
                className="font-display uppercase tracking-widest flex items-center flex-wrap gap-2"
                style={{ fontSize: '0.625rem', color: 'var(--ds-text-1)', letterSpacing: '0.15em' }}
              >
                {project.testimonial_author}
                {project.testimonial_role && (
                  <><span style={{ color: 'var(--ds-accent)' }}>·</span>
                  <span style={{ color: 'var(--ds-accent)' }}>{project.testimonial_role}</span></>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Results section ───────────────────────────────────────────────── */}
      {hasResults && (
        <div
          ref={resultsRef}
          className="relative overflow-hidden py-24 md:py-40 grain-bg"
          style={{ background: 'var(--ds-text-1)', borderTop: '1px solid var(--ds-border)' }}
        >
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">
            <div className="cs-r mb-14 md:mb-20">
              <h2
                className="font-display"
                style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', color: 'var(--ds-bg)', lineHeight: 0.95, letterSpacing: '0.01em' }}
              >
                {project.results_headline || project.outcome}
              </h2>
            </div>

            {resultMetrics.length > 0 && (
              <div className="cs-r flex flex-wrap justify-center gap-12 md:gap-24 mb-14">
                {resultMetrics.map((m, i) => (
                  <div key={i} className="text-center">
                    <p className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--ds-accent)', lineHeight: 1 }}>
                      {m.value}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-widest" style={{ color: 'color-mix(in srgb, var(--ds-bg) 55%, transparent)' }}>
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="cs-r">
              <Link to="/#contact" className="btn-primary">
                {project.results_cta || 'Start a Project'} <HiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CaseStudyWeb
