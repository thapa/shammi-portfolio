import { useEffect, useRef } from 'react'
import { useContent } from '../../../context/ContentContext'
import { gsap, SplitText } from '../../../lib/gsap'

const ProcessSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex flex-col items-start">
        <div className="w-16 h-16 animate-pulse mb-6" style={{ background: 'var(--ds-bg-elevated)' }} />
        <div className="h-5 w-20 animate-pulse mb-2" style={{ background: 'var(--ds-bg-elevated)' }} />
        <div className="h-4 w-full animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
      </div>
    ))}
  </div>
)

const Process = () => {
  const { processSteps, loading } = useContent()

  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const headingRef = useRef(null)
  const subtitleRef = useRef(null)
  const lineRef = useRef(null)
  const stepsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { start: 'top 82%', once: true }

      gsap.from(labelRef.current, {
        y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: labelRef.current, ...st },
      })

      const split = new SplitText(headingRef.current, { type: 'words' })
      gsap.from(split.words, {
        y: 48, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, ...st },
      })

      gsap.from(subtitleRef.current, {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: subtitleRef.current, start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (loading || !stepsRef.current) return

    const ctx = gsap.context(() => {
      // Connecting line draw
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power2.inOut',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 80%', once: true },
        })
      }

      // Step cards stagger in
      const cards = stepsRef.current.children
      if (cards.length) {
        gsap.from(cards, {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 82%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 transition-colors duration-300"
      style={{ background: 'var(--ds-bg-surface)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <p ref={labelRef} className="section-label mb-4">
              Process
            </p>
            <h2
              ref={headingRef}
              className="section-heading max-w-lg"
            >
              A methodical process for maximum results
            </h2>
          </div>
          <p ref={subtitleRef} className="body-text max-w-xs">
            A proven five-step workflow that delivers quality, on time, every time.
          </p>
        </div>

        {loading ? (
          <ProcessSkeleton />
        ) : (
          <div className="relative">
            <div
              ref={lineRef}
              className="hidden md:block absolute top-8 left-8 right-8 h-px z-0"
              style={{ background: 'var(--ds-border)' }}
            />
            <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-5 gap-10 relative z-10">
              {processSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-start">
                  <div
                    className="w-16 h-16 flex items-center justify-center mb-6 flex-shrink-0"
                    style={{
                      border: '1px solid var(--ds-border)',
                      background: 'var(--ds-bg)',
                    }}
                  >
                    <span
                      className="font-display text-xs"
                      style={{ color: 'var(--ds-text-1)', letterSpacing: '0.06em' }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-medium mb-2" style={{ color: 'var(--ds-text-1)' }}>
                    {step.title}
                  </h3>
                  <p className="body-text">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Process
