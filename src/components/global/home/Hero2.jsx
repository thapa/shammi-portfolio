import { HiArrowRight } from 'react-icons/hi'
import { useContent } from '../../../context/ContentContext'

// ─── Floating CRO metrics (background ambience) ──────────────────────────────
const metrics = [
  { text: '+47% CVR', x: '4%', delay: '0s' },
  { text: 'ROAS 4.2x', x: '12%', delay: '-2s' },
  { text: '3.2% CR', x: '22%', delay: '-4.5s' },
  { text: 'CTR 6.8%', x: '32%', delay: '-1.5s' },
  { text: 'LTV $240', x: '43%', delay: '-6s' },
  { text: '+12% uplift', x: '54%', delay: '-3s' },
  { text: 'AOV +$31', x: '64%', delay: '-7.5s' },
  { text: 'CPC −22%', x: '73%', delay: '-1s' },
  { text: '14% A/B win', x: '82%', delay: '-5s' },
  { text: 'ROAS 5.1x', x: '90%', delay: '-3.5s' },
]

// ─── Hero2 ────────────────────────────────────────────────────────────────────
const Hero2 = () => {
  const { stats, loading } = useContent()

  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden transition-colors duration-300"
      style={{
        background: 'var(--ds-bg)',
        minHeight: '100svh',
        paddingTop: '120px',
        paddingBottom: 'clamp(72px, 12vw, 128px)',
      }}
    >
      {/* ── Grid lines (::before equivalent) ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(var(--hero-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          opacity: 0.7,
        }}
      />

      {/* ── Ascending metrics field ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {metrics.map(({ text, x, delay }) => (
          <span
            key={text}
            className="hero-metric"
            style={{ '--mx': x, '--md': delay }}
          >
            {text}
          </span>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 w-full">

        <div className="max-w-full">
          {/* Eyebrow */}
          <p className="flex items-center gap-3 mb-8">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: 'var(--ds-accent)', animation: 'blink 2.8s ease-in-out infinite' }}
              aria-hidden="true"
            />
            <span className="section-label" style={{ color: 'var(--ds-text-2)' }}>
              CRO Specialist. Shopify &amp; WordPress Developer. Available for projects.
            </span>
          </p>

          {/* Headline */}
          <h1
            className="font-display uppercase mb-10"
            style={{
              fontSize: 'clamp(2.75rem, 8.5vw, 6rem)',
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: 'var(--ds-text-1)',
              maxWidth: '14ch',
              textWrap: 'balance',
            }}
          >
            Conversions don't happen by{' '}
            <em style={{ fontStyle: 'normal', color: 'var(--ds-accent)' }}>accident.</em>
          </h1>

          {/* Subtitle */}
          <p
            className="body-text mb-10 max-w-xl"
          >
            I build Shopify stores, WordPress sites, and CRO programs that turn traffic into revenue.
            The work is part code, part psychology, and the only number I care about is the one on your dashboard.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-16 md:mb-5">
            <a href="#contact" className="btn-primary">
              Start a project <HiArrowRight size={14} />
            </a>
            <a
              href="#projects"
              className="relative inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.05em] px-5 py-3.5 transition-colors"
              style={{
                color: 'var(--ds-text-2)',
                border: '1px solid var(--ds-border)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ds-text-1)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ds-text-2)'}
            >
              View selected work
            </a>
          </div>
        </div>

        {/* Stats Card - Right Aligned Horizontal */}
        <div className="flex justify-start md:justify-end w-full">
          <div className="liquid-glass rounded-2xl p-6 md:p-10 border border-[var(--ds-border)]/50 transition-all duration-300 relative overflow-hidden inline-block w-full md:w-auto">
            {/* Subtle highlight effect inside the glass */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="flex flex-row flex-wrap md:flex-nowrap gap-x-12 gap-y-8 relative z-10">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="h-8 w-20 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
                    <div className="h-3 w-24 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
                  </div>
                ))
              ) : (
                stats.map((s) => (
                  <div key={s.id} className="flex flex-col gap-1">
                    <span
                      className="font-display text-3xl md:text-4xl font-medium tracking-tight whitespace-nowrap"
                      style={{ color: 'var(--ds-text-1)' }}
                    >
                      {s.value}
                    </span>
                    <span
                      className="section-label mt-1 whitespace-nowrap"
                      style={{ color: 'var(--ds-text-3)' }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <span
        className="absolute hidden md:block select-none"
        aria-hidden="true"
        style={{
          bottom: '40px',
          right: 'clamp(24px, 5vw, 64px)',
          fontSize: '0.6875rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ds-text-3)',
          writingMode: 'vertical-rl',
        }}
      >
        Scroll
      </span>
    </section>
  )
}

export default Hero2
