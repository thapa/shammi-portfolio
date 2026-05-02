import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'

// ─── Partner logos — text-only, monochrome, single accent ─────────────────────
const partners = [
  { id: 'shopify',      name: 'Shopify' },
  { id: 'shopifyplus',  name: 'Shopify Plus' },
  { id: 'vwo',          name: 'VWO' },
  { id: 'judgeme',       name: 'Judge.me' },
  { id: 'klaviyo',      name: 'Klaviyo' },
  { id: 'lionwheel',    name: 'LionWheel' },
  { id: 'loloyal',      name: 'Loloyal' },
  { id: 'gelato',       name: 'Gelato' },
  { id: 'yotpo',        name: 'Yotpo' },
  { id: 'recharge',     name: 'Recharge' },
]

// ─── Component ────────────────────────────────────────────────────────────────
const TechPartners = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const gridRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current.children, {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
      })

      gsap.from(gridRef.current.children, {
        opacity: 0, y: 12, duration: 0.5, stagger: 0.05, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 88%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 transition-colors duration-300"
      style={{ background: 'var(--ds-bg)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headingRef} className="mb-14">
          <p className="section-label mb-4">
            Partners
          </p>
          <h2 className="section-heading mb-4">
            Working with the{' '}
            <span style={{ color: 'var(--ds-accent)' }}>best tech.</span>
          </h2>
          <p
            className="text-sm leading-relaxed max-w-sm"
            style={{ color: 'var(--ds-text-2)' }}
          >
            Partnered with leading platforms in the Shopify ecosystem to deliver the best possible results.
          </p>
        </div>

        {/* Logo grid — bordered cells, text-only logos */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          style={{ borderTop: '1px solid var(--ds-border)', borderLeft: '1px solid var(--ds-border)' }}
        >
          {partners.map(({ id, name }) => (
            <div
              key={id}
              className="flex items-center justify-center py-8 px-6 transition-colors duration-200"
              style={{
                borderRight: '1px solid var(--ds-border)',
                borderBottom: '1px solid var(--ds-border)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ds-bg-surface)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span
                className="text-[0.9375rem] font-medium tracking-tight"
                style={{ color: 'var(--ds-text-2)' }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechPartners
