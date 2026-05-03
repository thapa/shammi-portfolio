import { useEffect, useRef } from 'react'
import { useContent } from '../../../context/ContentContext'
import { gsap, SplitText } from '../../../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
  const desktopLineFillRef = useRef(null)
  const mobileLineFillRef = useRef(null)
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
      const cards = stepsRef.current.children
      if (!cards.length) return

      const mm = gsap.matchMedia()

      // Desktop animation (Horizontal)
      mm.add("(min-width: 768px)", () => {
        // Fade in cards
        gsap.from(cards, {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 82%', once: true },
        })

        // Scrubbing horizontal line
        if (desktopLineFillRef.current) {
          const scrubTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 40%',
              end: 'bottom 60%',
              scrub: true,
            }
          })

          // Draw line from 0 to 100% width
          scrubTl.to(desktopLineFillRef.current, { scaleX: 1, ease: 'none', duration: 1 }, 0)

          // Light up the boxes sequentially
          const steps = gsap.utils.toArray('.process-step')
          const stepInterval = 1 / (steps.length - 1 || 1)

          steps.forEach((step, i) => {
            const box = step.querySelector('.step-box')
            if (box) {
              // Add a color tween precisely when the line reaches this box's percentage
              scrubTl.to(box, { borderColor: 'var(--ds-accent)', duration: 0.1 }, i * stepInterval)
            }
          })
        }
      })

      // Mobile animation (Vertical)
      mm.add("(max-width: 767px)", () => {
        // Fade up cards
        gsap.from(cards, {
          y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 85%', once: true },
        })

        // Scrubbing vertical line
        if (mobileLineFillRef.current) {
          gsap.to(mobileLineFillRef.current, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 50%',
              end: 'bottom 50%',
              scrub: true,
            }
          })
        }

        // Dot interactive lighting based on viewport position
        const steps = gsap.utils.toArray('.process-step')
        steps.forEach((step) => {
          const dot = step.querySelector('.step-dot')
          const box = step.querySelector('.step-box')

          if (dot) {
            ScrollTrigger.create({
              trigger: step,
              start: 'top 50%',
              onEnter: () => {
                gsap.to(dot, { backgroundColor: 'var(--ds-accent)', borderColor: 'var(--ds-accent)', duration: 0.3 })
                if (box) gsap.to(box, { borderColor: 'var(--ds-accent)', duration: 0.3 })
              },
              onLeaveBack: () => {
                gsap.to(dot, { backgroundColor: 'var(--ds-bg)', borderColor: 'var(--ds-border)', duration: 0.3 })
                if (box) gsap.to(box, { borderColor: 'var(--ds-border)', duration: 0.3 })
              }
            })
          }
        })
      })

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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20 md:mb-32">
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
            {/* Desktop Horizontal Timeline Background Line */}
            <div
              className="hidden md:block absolute top-8 left-8 right-8 h-px z-0"
              style={{ background: 'var(--ds-border)' }}
            />
            {/* Desktop Horizontal Timeline Active Fill */}
            <div
              ref={desktopLineFillRef}
              className="hidden md:block absolute top-8 left-8 right-8 h-px z-10 origin-left"
              style={{ background: 'var(--ds-accent)', transform: 'scaleX(0)' }}
            />

            {/* Mobile Vertical Timeline Background Line */}
            <div
              className="md:hidden absolute top-8 bottom-0 left-[1px] w-px z-0"
              style={{ background: 'var(--ds-border)' }}
            />
            {/* Mobile Vertical Timeline Active Fill */}
            <div
              ref={mobileLineFillRef}
              className="md:hidden absolute top-8 left-[1px] w-px z-10"
              style={{ background: 'var(--ds-accent)', height: '0%' }}
            />

            <div ref={stepsRef} className="flex flex-col gap-12 md:gap-10 md:grid md:grid-cols-5 relative z-10 pl-8 md:pl-0">
              {processSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-start relative process-step">
                  {/* Timeline Dot (Mobile Only) */}
                  <div
                    className="step-dot md:hidden absolute -left-8 top-8 w-[7px] h-[7px] -translate-x-[2px] -translate-y-1/2 rounded-full z-20 transition-colors duration-300"
                    style={{ background: 'var(--ds-bg)', border: '1px solid var(--ds-border)' }}
                  />

                  <div
                    className="step-box w-16 h-16 flex items-center justify-center mb-6 flex-shrink-0 transition-colors duration-300"
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
                  <h3 className="font-medium mb-3 md:text-lg tracking-tight" style={{ color: 'var(--ds-text-1)' }}>
                    {step.title}
                  </h3>
                  <p className="body-text text-sm md:text-base max-w-lg leading-relaxed">
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
