import { useEffect, useRef } from 'react'
import { useContent } from '../../../context/ContentContext'
import { gsap, SplitText } from '../../../lib/gsap'

const ProcessSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex flex-col items-start">
        <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-6" />
        <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse mt-1" />
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
      className="bg-neutral-50 dark:bg-neutral-900 py-24 md:py-32 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <p ref={labelRef} className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">
              How I Work
            </p>
            <h2
              ref={headingRef}
              className="font-display text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight max-w-lg"
            >
              A Methodical Process For Maximum Results
            </h2>
          </div>
          <p ref={subtitleRef} className="text-neutral-500 dark:text-neutral-500 text-sm max-w-xs leading-relaxed">
            A proven five-step workflow that delivers quality, on time, every time.
          </p>
        </div>

        {loading ? (
          <ProcessSkeleton />
        ) : (
          <div className="relative">
            <div
              ref={lineRef}
              className="hidden md:block absolute top-8 left-8 right-8 h-px bg-neutral-200 dark:bg-neutral-800 z-0"
            />
            <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-5 gap-10 relative z-10">
              {processSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-start">
                  <div className="w-16 h-16 rounded-full border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0E0E0E] flex items-center justify-center mb-6 flex-shrink-0">
                    <span className="font-display text-sm font-bold text-neutral-900 dark:text-white">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
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
