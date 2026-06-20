import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap'

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

// ── Placeholder panel for compare slider ────────────────────────────────────
const Placeholder = ({ dark }) => {
  const bg = dark ? 'var(--ds-bg-elevated)' : 'var(--ds-bg-surface)'
  const icon = dark ? 'oklch(32% 0.005 220)' : 'oklch(70% 0.008 220)'
  const lbl = dark ? 'oklch(38% 0.005 220)' : 'oklch(62% 0.008 220)'

  return (
    <div style={{ background: bg, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
        <rect x="1" y="1" width="42" height="34" rx="2" stroke={icon} strokeWidth="1.4" />
        <circle cx="14" cy="14" r="4" stroke={icon} strokeWidth="1.4" />
        <path d="M1 26L13 16L20 22L30 14L43 26" stroke={icon} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <p style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: lbl, fontFamily: '"Michroma", sans-serif' }}>
        Screenshot placeholder
      </p>
    </div>
  )
}

// ── Browser frame ─────────────────────────────────────────────────────────────
const BrowserFrame = ({ src, label, align = 'left', hideLabel = false }) => (
  <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--ds-bg-surface)' }}>
    <div
      className="flex items-center gap-3 px-3 md:px-4 h-11 flex-shrink-0"
      style={{ background: 'oklch(20% 0.006 220)', borderBottom: '1px solid oklch(30% 0.006 220)' }}
    >
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'oklch(65% 0.21 28)' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'oklch(78% 0.16 88)' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'oklch(72% 0.16 150)' }} />
      </div>
      <div className="min-w-0 flex-1" />
    </div>

    <div className="relative flex-1 overflow-hidden">
      {src ? (
        <img
          src={src}
          alt={`${label} homepage hero test`}
          draggable="false"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'top center' }}
        />
      ) : (
        <Placeholder dark={false} />
      )}
      {!hideLabel && (
        <span
          className="absolute top-3 text-[9px] md:text-[10px] font-display uppercase"
          style={{
            [align]: '12px',
            letterSpacing: '0.12em',
            background: label === 'Variant' ? 'var(--ds-accent)' : 'oklch(96% 0.006 220)',
            color: label === 'Variant' ? 'var(--ds-bg)' : 'oklch(18% 0.012 220)',
            border: label === 'Variant' ? '1px solid var(--ds-accent)' : '1px solid oklch(78% 0.01 220)',
            padding: '5px 10px',
          }}
        >
          {label}
        </span>
      )}
    </div>
  </div>
)

// ── Drag-to-compare slider ───────────────────────────────────────────────────
const CompareSlider = ({ beforeSrc, afterSrc }) => {
  const [pos, setPos] = useState(54)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const move = useCallback((clientX) => {
    if (!containerRef.current) return
    const { left, width } = containerRef.current.getBoundingClientRect()
    setPos(Math.min(Math.max(((clientX - left) / width) * 100, 2), 98))
  }, [])

  const stopDragging = useCallback(() => { dragging.current = false }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPos((v) => Math.max(v - 4, 2)) }
    if (e.key === 'ArrowRight') { e.preventDefault(); setPos((v) => Math.min(v + 4, 98)) }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      role="slider"
      aria-label="Compare homepage hero before and after"
      aria-valuemin={2}
      aria-valuemax={98}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      style={{
        aspectRatio: '16 / 9',
        cursor: 'ew-resize',
        border: '1px solid var(--ds-border)',
        borderRadius: 8,
        background: 'var(--ds-bg-elevated)',
        touchAction: 'none',
      }}
      onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX) }}
      onPointerMove={(e) => { if (dragging.current) move(e.clientX) }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onLostPointerCapture={stopDragging}
      onKeyDown={handleKeyDown}
    >
      {/* Variant — full width, behind */}
      <div className="absolute inset-0">
        <BrowserFrame src={afterSrc} label="Variant" align="right" />
      </div>

      {/* Control — clipped left */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <BrowserFrame src={beforeSrc} label="Control" />
      </div>

      {/* Divider + handle */}
      <div
        className="absolute top-0 bottom-0 z-10 flex items-center"
        style={{ top: 44, left: `${pos}%`, transform: 'translateX(-50%)', pointerEvents: 'none' }}
      >
        <div style={{ position: 'absolute', width: 2, height: '100%', background: 'var(--ds-accent)', left: '16px' }} />
        <div
          className="relative flex items-center justify-center"
          style={{ width: 34, height: 34, background: 'var(--ds-accent)', cursor: 'ew-resize', flexShrink: 0, pointerEvents: 'all' }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M4 1L1 5L4 9M10 1L13 5L10 9" stroke="oklch(12% 0 0)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── CRO Case Study — dynamic ──────────────────────────────────────────────────
const CaseStudyCRO = ({ project }) => {
  const titleRef = useRef(null)
  const metricsRef = useRef(null)
  const narrativeRef = useRef(null)
  const resultsRef = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: 'words' })
        gsap.from(split.words, { y: 48, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out', delay: 0.15 })
      }
      if (metricsRef.current) {
        gsap.from(Array.from(metricsRef.current.children), {
          y: 28, opacity: 0, duration: 0.55, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: metricsRef.current, start: 'top 83%', once: true },
        })
      }
      if (narrativeRef.current) {
        gsap.from(Array.from(narrativeRef.current.children), {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: narrativeRef.current, start: 'top 80%', once: true },
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
  const d = project.case_study_data || {}

  const meta = [
    { label: 'Client',        value: project.client_name || project.title },
    { label: 'Engagement',    value: d.engagement || 'Full-Funnel, CRO' },
    { label: 'Window',        value: d.window || '—' },
    { label: 'Tests Shipped', value: d.tests_shipped || '—' },
  ]

  const section = {
    number:   d.section_number || '01',
    title:    d.section_title  || project.title,
    testId:   d.test_id        || '',
    duration: d.test_duration  || '',
  }

  const testMetrics = d.test_metrics || []
  const beforeSrc   = d.before_image_url || null
  const afterSrc    = d.after_image_url  || null

  const hasNarrative = d.hypothesis || d.fix
  const hasResults   = project.results_headline || project.outcome
  const resultMetrics = project.metrics || []

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
              <p className="text-sm font-medium" style={{ color: 'var(--ds-text-1)' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section header ────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--ds-bg-surface)', borderBottom: '1px solid var(--ds-border)' }}>
        <div
          className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 flex items-center justify-between gap-6"
          style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)' }}
        >
          <div className="flex items-center gap-4 md:gap-5 min-w-0">
            <h1
              ref={titleRef}
              className="font-display uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--ds-text-1)' }}
            >
              {section.title}
            </h1>
          </div>

          {(section.testId || section.duration) && (
            <div className="hidden md:flex flex-col items-end gap-1.5 flex-shrink-0">
              {section.testId && (
                <p className="section-label">
                  Test Name&nbsp;&nbsp;<span style={{ color: 'var(--ds-text-2)', fontVariantNumeric: 'tabular-nums' }}>{section.testId}</span>
                </p>
              )}
              {section.duration && (
                <p className="section-label">
                  Duration&nbsp;&nbsp;<span style={{ color: 'var(--ds-text-2)' }}>{section.duration}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Compare slider ────────────────────────────────────────────────── */}
      <div
        className="max-w-[1200px] mx-auto px-6 md:px-10 pt-8 mb-10"
        style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)' }}
      >
        <p
          className="text-center mb-5"
          style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ds-accent)' }}
        >
          ● Drag the line to compare
        </p>
        <CompareSlider beforeSrc={beforeSrc} afterSrc={afterSrc} />

        <div className="mt-16">
          <p
            className="text-center mb-5"
            style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ds-accent)' }}
          >
            ● Side by side view
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
            {[
              { src: beforeSrc, label: 'Control', accent: false },
              { src: afterSrc,  label: 'Variant', accent: true },
            ].map(({ src, label, accent }) => (
              <div key={label}>
                <div
                  className="relative overflow-hidden mb-3"
                  style={{ aspectRatio: '16 / 9', border: '1px solid var(--ds-border)', borderRadius: 8, background: 'var(--ds-bg-elevated)' }}
                >
                  <BrowserFrame src={src} label={label} align={accent ? 'right' : 'left'} hideLabel={true} />
                </div>
                <span
                  className="inline-block text-[9px] md:text-[10px] font-display uppercase"
                  style={{
                    letterSpacing: '0.12em',
                    background: accent ? 'var(--ds-accent)' : 'oklch(96% 0.006 220)',
                    color: accent ? 'var(--ds-bg)' : 'oklch(18% 0.012 220)',
                    border: accent ? '1px solid var(--ds-accent)' : '1px solid oklch(78% 0.01 220)',
                    padding: '5px 10px',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Test Metrics row ──────────────────────────────────────────────── */}
      {testMetrics.length > 0 && (
        <div
          className="max-w-[1200px] mx-auto"
          style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)', borderTop: '1px solid var(--ds-border)' }}
        >
          <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-4">
            {testMetrics.map((m, i) => (
              <div
                key={i}
                className="px-6 md:px-8 py-7"
                style={{
                  borderRight: i < testMetrics.length - 1 ? '1px solid var(--ds-border)' : 'none',
                  background: m.accent ? 'var(--ds-accent)' : 'var(--ds-bg-surface)',
                }}
              >
                <p className="section-label mb-3" style={{ color: m.accent ? 'var(--ds-bg)' : undefined }}>
                  {m.label}
                </p>
                <p
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.05rem)',
                    lineHeight: 1,
                    color: m.accent ? 'var(--ds-bg)' : 'var(--ds-text-1)',
                  }}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Hypothesis + Fix ──────────────────────────────────────────────── */}
      {hasNarrative && (
        <div className="pt-16 md:pt-24 pb-12 md:pb-16" style={{ borderTop: '1px solid var(--ds-border)' }}>
          <div
            ref={narrativeRef}
            className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
            style={{ borderLeft: '1px solid var(--ds-border)', borderRight: '1px solid var(--ds-border)' }}
          >
            {d.hypothesis && (
              <div>
                <p className="font-display uppercase mb-5" style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', color: 'var(--ds-text-1)' }}>
                  Hypothesis
                </p>
                <RichText parts={[d.hypothesis]} className="body-text" />
              </div>
            )}
            {d.fix && (
              <div>
                <p className="font-display uppercase mb-5" style={{ fontSize: '0.8125rem', letterSpacing: '0.1em', color: 'var(--ds-text-1)' }}>
                  The Fix
                </p>
                <RichText parts={[d.fix]} className="body-text" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Testimonial ───────────────────────────────────────────────────── */}
      {project.testimonial_quote && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-16 md:pb-24">
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
                {project.results_cta || 'Run a Test Like This'} <HiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CaseStudyCRO
