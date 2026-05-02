import { useEffect, useRef } from 'react'

const CustomCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const stateRef = useRef('default')

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    let mouseX = -200
    let mouseY = -200
    let ringX = -200
    let ringY = -200
    let rafId
    let visible = true

    // Dot follows mouse exactly
    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`

      // Restore visibility on any mouse move
      if (!visible) {
        visible = true
        applyState(stateRef.current)
      }
    }

    // Ring follows with smooth lag
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    window.addEventListener('mousemove', onMouseMove)

    // ── State machine ──────────────────────────────────────────────
    const applyState = (next) => {
      stateRef.current = next

      if (next === 'default') {
        ring.style.width = '36px'
        ring.style.height = '36px'
        ring.style.backgroundColor = 'transparent'
        ring.style.borderColor = 'rgba(92,81,254,0.5)'
        ring.style.opacity = '1'
        dot.style.opacity = '1'
        label.style.opacity = '0'
      } else if (next === 'hover') {
        ring.style.width = '52px'
        ring.style.height = '52px'
        ring.style.backgroundColor = 'transparent'
        ring.style.borderColor = 'rgba(92,81,254,0.9)'
        ring.style.opacity = '1'
        dot.style.opacity = '0'
        label.style.opacity = '0'
      } else if (next === 'view') {
        ring.style.width = '80px'
        ring.style.height = '80px'
        ring.style.backgroundColor = 'var(--ds-accent)'
        ring.style.borderColor = 'var(--ds-accent)'
        ring.style.opacity = '1'
        dot.style.opacity = '0'
        label.style.opacity = '1'
      }
    }

    applyState('default')

    const onOver = (e) => {
      const el = e.target
      // Ignore iframe content (e.g. Spline) — just keep current state
      if (el.tagName === 'IFRAME') return
      if (el.closest('[data-cursor="view"]')) {
        applyState('view')
      } else if (el.closest('a, button, input, textarea, select, label, [role="button"]')) {
        applyState('hover')
      } else {
        applyState('default')
      }
    }

    // Only hide cursor when mouse truly leaves the browser window
    // (not when entering iframes — relatedTarget is null only on real exit)
    const onMouseOut = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        visible = false
        dot.style.opacity = '0'
        ring.style.opacity = '0'
      }
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Dot — fast, exact */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2"
        style={{
          background: 'var(--ds-accent)',
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
          transition: 'opacity 0.15s ease',
        }}
      />

      {/* Ring — lagged, scales on state change */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none border flex items-center justify-center"
        style={{
          width: '36px',
          height: '36px',
          borderColor: 'var(--ds-accent)',
          backgroundColor: 'transparent',
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
          transition:
            'width 0.25s cubic-bezier(0.25,0.46,0.45,0.94), height 0.25s cubic-bezier(0.25,0.46,0.45,0.94), background-color 0.2s ease, border-color 0.2s ease, opacity 0.15s ease',
        }}
      >
        <span
          ref={labelRef}
          className="text-[#0E0E0E] text-xs font-bold uppercase tracking-widest select-none"
          style={{ opacity: 0, transition: 'opacity 0.15s ease' }}
        >
          View
        </span>
      </div>
    </>
  )
}

export default CustomCursor
