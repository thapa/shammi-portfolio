import { useEffect, useRef } from 'react'
import { gsap, SplitText, ScrollTrigger } from '../../../lib/gsap'

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    num: '01',
    title: 'CRO Audit',
    description: 'A full forensic review of your funnel: heatmaps, session recordings, form analytics, and exit data, synthesized into a prioritized roadmap of high-impact fixes.',
    tags: ['Heatmaps', 'Session Recording', 'A/B Testing', 'GA4'],
    detailText: 'The audit isolates where qualified visitors lose confidence, momentum, or clarity. You get a ranked backlog with impact, effort, evidence, and the exact page-level changes needed for testing or implementation.',
    includes: [
      'Analytics review across acquisition, product, cart, checkout, and lead capture flows.',
      'Session-pattern analysis with recurring objections and friction points grouped by page.',
      'Prioritized experiment roadmap with copy, layout, and measurement recommendations.'
    ]
  },
  {
    num: '02',
    title: 'CRO Strategy & Testing',
    description: 'An ongoing testing program for stores with enough traffic to learn from. Hypotheses, builds, QA, and post-test analysis run end to end.',
    tags: ['A/B Testing', 'VWO', 'Optimizely', 'Hypothesis Design'],
    detailText: 'I run tests when there is a real question worth answering, not to keep the dashboard busy. Each test ships with a written hypothesis, a sample-size target, and a decision rule, so the result is something you can act on the day it closes.',
    includes: [
      'Quarterly test roadmap built from audit findings and live performance data.',
      'Hypothesis design, variant build, and QA across desktop, mobile, and tablet.',
      'Statistical readout with winner rationale, segment breakdowns, and follow-up tests queued up.'
    ]
  },
  {
    num: '03',
    title: 'Shopify Development',
    description: 'Custom Shopify and Shopify Plus builds tuned for conversion: clean Liquid, fast pages, and PDP and checkout flows that move real volume.',
    tags: ['Shopify Themes', 'Liquid', 'Checkout', 'Conversion Flows'],
    detailText: 'I build for stores that already make money and want to make more, not for vanity metrics. Performance is treated as a conversion lever from day one, not a separate audit you have to commission later.',
    includes: [
      'Custom theme development with reusable sections and merchandising controls editors can actually use.',
      'PDP, cart, and checkout optimization on Shopify Plus, including checkout extensibility work.',
      'Core Web Vitals, image pipelines, and third-party script load tightened up before launch.'
    ]
  },
  {
    num: '04',
    title: 'WordPress Development',
    description: 'Fast, well-structured WordPress builds with content models that hold up six months and three editors later.',
    tags: ['Custom Themes', 'ACF', 'Core Web Vitals', 'WooCommerce'],
    detailText: 'ACF Pro, custom blocks, and a clean Gutenberg editing experience for the team that has to update the site every week. Accessibility and SEO are part of the build, not a phase two.',
    includes: [
      'Custom theme development with ACF Pro, custom blocks, and reusable patterns.',
      'WooCommerce builds covering product, cart, and checkout customization for real catalogs.',
      'Performance, accessibility, and on-page SEO shipped on the same release as the design.'
    ]
  },
  {
    num: '05',
    title: 'Landing Page Design',
    description: 'Standalone landing pages designed for paid traffic and built to be tested. Hand-coded, lightweight, and ready to plug into your testing stack.',
    tags: ['Conversion Copy', 'A/B Variants', 'HTML / CSS', 'Analytics'],
    detailText: 'Pages start at the smallest viable version and earn their way to being a full-blown experiment. You get a page that looks like the design but acts like a salesperson—fast, direct, and focused on the next step.',
    includes: [
      'Conversion-focused copy and design optimized for specific acquisition channels.',
      'Direct-to-code implementation for 90+ lighthouse scores and total layout control.',
      'Event tracking and analytics instrumentation to capture every scroll and click.'
    ]
  }
]

const Services = () => {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const headingRef = useRef(null)
  const subtitleRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = listRef.current
      const cards = gsap.utils.toArray('.service-slide')

      // Horizontal Scroll Animation
      const mm = gsap.matchMedia()
      mm.add("(min-width: 768px)", () => {
        const totalWidth = items.scrollWidth
        const winWidth = window.innerWidth

        gsap.to(items, {
          x: -(totalWidth - winWidth + 100), // padding at the end
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        })
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative grain-bg dot-bg overflow-hidden md:h-screen flex flex-col transition-colors duration-300"
      style={{ background: 'var(--ds-bg)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="w-full h-full flex flex-col">
        {/* Static Header Container */}
        <div className="relative z-20 w-full pt-24 md:pt-32 mb-12 md:mb-16 px-6 md:px-10 max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-24 items-end">
            <div>
              <p ref={labelRef} className="section-label mb-4">Services</p>
              <h2 ref={headingRef} className="section-heading">
                What I do.
              </h2>
            </div>
            <p ref={subtitleRef} className="body-text max-w-sm ml-auto self-end">
              Every engagement starts with one question: what is stopping your visitors from buying? Then we go answer it.
            </p>
          </div>
        </div>

        {/* Horizontal Cards Container */}
        <div className="relative z-10 w-full flex-1 flex items-start overflow-visible">
          <div
            ref={listRef}
            className="flex flex-nowrap gap-8 md:gap-12 px-6 md:px-10 lg:pl-[calc((100vw-1200px)/2+2.5rem)] scrollbar-hide overflow-x-auto md:overflow-visible pb-32"
            style={{ width: 'max-content' }}
          >
            {services.map((s) => (
              <div
                key={s.num}
                className="service-slide w-[85vw] md:w-[1200px] shrink-0"
              >
                <div className="liquid-glass p-8 md:p-12 w-full transition-all duration-300">
                  <div className="grid md:grid-cols-[56px,1fr] gap-x-12 gap-y-10 items-start">
                    <span className="section-label pt-1 text-[var(--ds-accent)] tabular-nums">
                      {s.num}
                    </span>

                    <div className="flex flex-col gap-12">
                      <div>
                        <h3
                          className="text-2xl font-medium mb-4"
                          style={{ fontFamily: 'var(--ds-font-display)', color: 'var(--ds-text-1)' }}
                        >
                          {s.title}
                        </h3>
                        <p className="body-text mb-8 max-w-2xl">
                          {s.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {s.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[0.625rem] font-medium tracking-widest uppercase px-2.5 py-1.5 border border-[var(--ds-border)]"
                              style={{ color: 'var(--ds-text-3)' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 pt-10 border-t border-[var(--ds-border)]/50">
                        <div className="space-y-4">
                          <span className="section-label block mb-4 text-[var(--ds-text-3)]">Objective</span>
                          <p className="body-text text-[var(--ds-text-2)] leading-relaxed">
                            {s.detailText}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <span className="section-label block mb-4 text-[var(--ds-text-3)]">Includes</span>
                          <ul className="flex flex-col gap-3">
                            {s.includes.map((item, idx) => (
                              <li key={idx} className="body-text text-[0.875rem] flex gap-3 leading-snug">
                                <span className="w-1.5 h-1.5 bg-[var(--ds-accent)] shrink-0 mt-2"></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
