import { useEffect, useRef } from 'react'

const CustomCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const stateRef = useRef('default')

  useEffect(() => {
    // Only run on devices with a precise pointer (mouse), not touch
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

    // Dot follows mouse exactly
    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    // Ring follows with smooth lag
    const animate = () => {
      ringX += (mouseX - ringX) * 0.1
      ringY += (mouseY - ringY) * 0.1
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    window.addEventListener('mousemove', onMouseMove)

    // ── State machine ──────────────────────────────────────────────────────
    const applyState = (next) => {
      if (stateRef.current === next) return
      stateRef.current = next

      if (next === 'default') {
        ring.style.width = '36px'
        ring.style.height = '36px'
        ring.style.backgroundColor = 'transparent'
        ring.style.mixBlendMode = 'difference'
        ring.style.opacity = '0.5'
        dot.style.opacity = '1'
        dot.style.mixBlendMode = 'difference'
        label.style.opacity = '0'
      } else if (next === 'hover') {
        ring.style.width = '56px'
        ring.style.height = '56px'
        ring.style.backgroundColor = 'transparent'
        ring.style.mixBlendMode = 'difference'
        ring.style.opacity = '0.9'
        dot.style.opacity = '0'
        label.style.opacity = '0'
      } else if (next === 'view') {
        ring.style.width = '84px'
        ring.style.height = '84px'
        ring.style.backgroundColor = '#D9FB69'
        ring.style.mixBlendMode = 'normal'
        ring.style.opacity = '1'
        dot.style.opacity = '0'
        label.style.opacity = '1'
      }
    }

    const onOver = (e) => {
      const el = e.target
      if (el.closest('[data-cursor="view"]')) {
        applyState('view')
      } else if (el.closest('a, button, input, textarea, select, label, [role="button"]')) {
        applyState('hover')
      } else {
        applyState('default')
      }
    }

    const onMouseLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const onMouseEnter = () => {
      applyState(stateRef.current)
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Small dot — fast, exact */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full bg-white"
        style={{
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
          mixBlendMode: 'difference',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Ring — lagged, scales on hover */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border-2 border-white flex items-center justify-center"
        style={{
          width: '36px',
          height: '36px',
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
          mixBlendMode: 'difference',
          opacity: 0.5,
          // Transition everything except transform (that's handled by RAF)
          transition:
            'width 0.25s cubic-bezier(0.25,0.46,0.45,0.94), height 0.25s cubic-bezier(0.25,0.46,0.45,0.94), background-color 0.25s ease, opacity 0.2s ease, mix-blend-mode 0s',
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
