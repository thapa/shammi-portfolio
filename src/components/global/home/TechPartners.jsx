import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'

// ─── Shopify brand icon ────────────────────────────────────────────────────────
const ShopifyIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 256 292" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.806 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-11.131-10.537c1.617 0 3.246.549 4.805 1.622-12.007 5.65-24.877 19.88-30.312 48.297l-22.886 7.088C75.694 46.16 90.81 10.828 117.72 10.828z" fill="#95BF46"/>
    <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.959-2.394-1.099l-12.527 256.233 89.762-19.418S223.972 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357" fill="#5E8E3E"/>
    <path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338" fill="#FFF"/>
  </svg>
)

// ─── Partner logos ─────────────────────────────────────────────────────────────
const partners = [
  { id: 'shopify', name: 'Shopify', icon: <ShopifyIcon /> },
  { id: 'shopifyplus', name: 'Shopify Plus', icon: <ShopifyIcon /> },
  { id: 'vwo', name: 'VWO' },
  { id: 'judgeme', name: 'Judge.me' },
  { id: 'klaviyo', name: 'Klaviyo' },
  { id: 'lionwheel', name: 'LionWheel' },
  { id: 'loloyal', name: 'Loloyal' },
  { id: 'gelato', name: 'Gelato' },
  { id: 'yotpo', name: 'Yotpo' },
  { id: 'recharge', name: 'Recharge' },
]

// ─── Component ────────────────────────────────────────────────────────────────
const TechPartners = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const gridRef = useRef(null)

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
            className="body-text leading-relaxed max-w-sm"
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
          {partners.map(({ id, name, icon }) => (
            <div
              key={id}
              className="flex items-center justify-center gap-2 py-8 px-6 transition-colors duration-200"
              style={{
                borderRight: '1px solid var(--ds-border)',
                borderBottom: '1px solid var(--ds-border)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ds-bg-surface)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {icon && <span className="flex-shrink-0">{icon}</span>}
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
