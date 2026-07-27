import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'

// ─── Brand icons ───────────────────────────────────────────────────────────────

const ShopifyIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 256 292" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.806 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-11.131-10.537c1.617 0 3.246.549 4.805 1.622-12.007 5.65-24.877 19.88-30.312 48.297l-22.886 7.088C75.694 46.16 90.81 10.828 117.72 10.828z" fill="#95BF46"/>
    <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.959-2.394-1.099l-12.527 256.233 89.762-19.418S223.972 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357" fill="#5E8E3E"/>
    <path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338" fill="#FFF"/>
  </svg>
)

const WordPressIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 122.52 122.523" xmlns="http://www.w3.org/2000/svg">
    <g fill="#21759b">
      <path d="m8.708 61.26c0 20.802 12.089 38.779 29.619 47.298l-25.069-68.686c-2.916 6.536-4.55 13.769-4.55 21.388z"/>
      <path d="m96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501l19.138 56.925 11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z"/>
      <path d="m62.184 65.857-15.768 45.819c4.708 1.384 9.687 2.141 14.846 2.141 6.12 0 11.989-1.058 17.452-2.979-.141-.225-.269-.464-.374-.724z"/>
      <path d="m107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z"/>
      <path d="m61.262 0c-33.779 0-61.262 27.481-61.262 61.26 0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263-.001-33.779-27.487-61.26-61.265-61.26zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z"/>
    </g>
  </svg>
)

const WixIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="m0 7.354 2.113 9.292h.801a1.54 1.54 0 0 0 1.506-1.218l1.351-6.34a.171.171 0 0 1 .167-.137c.08 0 .15.058.167.137l1.352 6.34a1.54 1.54 0 0 0 1.506 1.218h.805l2.113-9.292h-.565c-.62 0-1.159.43-1.296 1.035l-1.26 5.545-1.106-5.176a1.76 1.76 0 0 0-2.19-1.324c-.639.176-1.113.716-1.251 1.365l-1.094 5.127-1.26-5.537A1.33 1.33 0 0 0 .563 7.354H0zm13.992 0a.951.951 0 0 0-.951.95v8.342h.635a.952.952 0 0 0 .951-.95V7.353h-.635zm1.778 0 3.158 4.66-3.14 4.632h1.325c.368 0 .712-.181.918-.486l1.756-2.59a.12.12 0 0 1 .197 0l1.754 2.59c.206.305.55.486.918.486h1.326l-3.14-4.632L24 7.354h-1.326c-.368 0-.712.181-.918.486l-1.772 2.617a.12.12 0 0 1-.197 0L18.014 7.84a1.108 1.108 0 0 0-.918-.486H15.77z"/>
  </svg>
)

const SquarespaceIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M22.655 8.719c-1.802-1.801-4.726-1.801-6.564 0l-7.351 7.35c-.45.45-.45 1.2 0 1.65.45.449 1.2.449 1.65 0l7.351-7.351c.899-.899 2.362-.899 3.264 0 .9.9.9 2.364 0 3.264l-7.239 7.239c.9.899 2.362.899 3.263 0l5.589-5.589c1.836-1.838 1.836-4.763.037-6.563zm-2.475 2.437c-.451-.45-1.201-.45-1.65 0l-7.354 7.389c-.9.899-2.361.899-3.262 0-.45-.45-1.2-.45-1.65 0s-.45 1.2 0 1.649c1.801 1.801 4.726 1.801 6.564 0l7.351-7.35c.449-.487.449-1.239.001-1.688zm-2.439-7.35c-1.801-1.801-4.726-1.801-6.564 0l-7.351 7.351c-.45.449-.45 1.199 0 1.649s1.2.45 1.65 0l7.395-7.351c.9-.899 2.371-.899 3.27 0 .451.45 1.201.45 1.65 0 .421-.487.421-1.199-.029-1.649h-.021zm-2.475 2.437c-.45-.45-1.2-.45-1.65 0l-7.351 7.389c-.899.9-2.363.9-3.265 0-.9-.899-.9-2.363 0-3.264l7.239-7.239c-.9-.9-2.362-.9-3.263 0L1.35 8.719c-1.8 1.8-1.8 4.725 0 6.563 1.801 1.801 4.725 1.801 6.564 0l7.35-7.351c.451-.488.451-1.238 0-1.688h.002z"/>
  </svg>
)

const KlaviyoIcon = ({ size = 22 }) => (
  <svg width={size} height={Math.round(size * 1.6)} viewBox="0 8 101 163" xmlns="http://www.w3.org/2000/svg" fill="currentColor" fillRule="evenodd">
    <path d="M57.268,147H1V9h99v138H82.491l-11.319,22.313L57.268,147z M19,27v104h17V98h3.825c1.403,0,2.456,0.25,3.158,0.578c0.702,0.328,1.404,1.071,2.105,2.147l18.317,27.319c0.748,1.124,1.59,1.854,2.526,2.321c0.935,0.468,2.081,0.634,3.438,0.634h15.65L61.018,96.128c-0.748-1.074-1.498-2.042-2.245-2.978c-0.75-0.936-1.614-1.735-2.597-2.437c0.982-0.607,1.895-1.312,2.737-2.131c0.842-0.818,1.66-1.791,2.457-2.773L83.757,59h-15.86c-1.451,0-2.622,0.346-3.509,0.883c-0.889,0.538-1.732,1.313-2.527,2.25L43.965,84.257c-0.749,0.889-1.451,1.711-2.105,2.038C41.205,86.623,40.292,87,39.123,87H36V27H19z"/>
  </svg>
)

const RechargeIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
)

const ReBuyIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.17 5H2V3H0v2a2 2 0 002 2h1.54l2.84 6.39L5.25 15c-.16.28-.25.61-.25.96C5 17.1 5.9 18 7 18h14v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H18c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0022.46 5H5.17z"/>
  </svg>
)

const ElementorIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#92003B">
    <path d="M12 0C5.372 0 0 5.372 0 12c0 6.626 5.372 12 12 12s12-5.372 12-12c0-6.626-5.372-12-12-12ZM9 17H7V7H9Zm8 0H11V15h6Zm0-4H11V11h6Zm0-4H11V7h6Z"/>
  </svg>
)

// ─── Partner list ──────────────────────────────────────────────────────────────
const partners = [
  { id: 'shopify',     name: 'Shopify',     icon: <ShopifyIcon /> },
  { id: 'wordpress',   name: 'WordPress',   icon: <WordPressIcon /> },
  { id: 'wix',         name: 'Wix',         icon: <WixIcon /> },
  { id: 'squarespace', name: 'Squarespace', icon: <SquarespaceIcon /> },
  { id: 'klaviyo',     name: 'Klaviyo',     icon: <KlaviyoIcon /> },
  { id: 'recharge',    name: 'reCharge',    icon: <RechargeIcon /> },
  { id: 'rebuy',       name: 'ReBuy',       icon: <ReBuyIcon /> },
  { id: 'elementor',   name: 'Elementor',   icon: <ElementorIcon /> },
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
            Partnered with leading platforms to deliver the best possible results.
          </p>
        </div>

        {/* Logo grid — 4 columns × 2 rows */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-4"
          style={{ borderTop: '1px solid var(--ds-border)', borderLeft: '1px solid var(--ds-border)' }}
        >
          {partners.map(({ id, name, icon }) => (
            <div
              key={id}
              className="flex items-center justify-center gap-2.5 py-8 px-6 transition-colors duration-200"
              style={{
                borderRight: '1px solid var(--ds-border)',
                borderBottom: '1px solid var(--ds-border)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ds-bg-surface)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span className="flex-shrink-0" style={{ color: 'var(--ds-text-2)' }}>{icon}</span>
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
