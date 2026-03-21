import { Suspense, lazy, useEffect, useRef } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiDownload, HiArrowRight } from 'react-icons/hi'
import { useContent } from '../../../context/ContentContext'
import { gsap, SplitText } from '../../../lib/gsap'

const Spline = lazy(() => import('@splinetool/react-spline'))

const stripe = [
  'WordPress Development',
  'Shopify Development',
  'Web Development',
  '200+ Projects',
  'Full-Stack Dev',
  '10+ Years Exp',
]

const StatSkeleton = () => (
  <div>
    <div className="h-9 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-1" />
    <div className="h-4 w-24 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
  </div>
)

const Hero = () => {
  const { stats, loading } = useContent()

  const shammiRef = useRef(null)
  const thapaRef = useRef(null)
  const badgeRef = useRef(null)
  const sideRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splitShammi = new SplitText(shammiRef.current, { type: 'chars' })
      const splitThapa = new SplitText(thapaRef.current, { type: 'chars' })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(splitShammi.chars, { y: 100, opacity: 0, duration: 0.9, stagger: 0.04 })
        .from(splitThapa.chars, { y: 100, opacity: 0, duration: 0.9, stagger: 0.04 }, '-=0.65')
        .from(badgeRef.current, { y: 24, opacity: 0, duration: 0.6 }, '-=0.4')
        .from(sideRef.current, { y: 32, opacity: 0, duration: 0.7 }, '-=0.35')
        .from(statsRef.current, { y: 24, opacity: 0, duration: 0.6 }, '-=0.3')
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col bg-white dark:bg-[#0E0E0E] pt-[73px] transition-colors duration-300 overflow-hidden"
    >
      <div className="relative flex-1 w-full">

        {/* Spline background — transparent, sits behind all content */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Suspense fallback={null}>
            <Spline
              scene="https://prod.spline.design/xZeonsrs0TQluk1G/scene.splinecode"
              className="w-full h-full"
            />
          </Suspense>
          {/* Cover Spline watermark badge */}
          <div className="absolute bottom-0 right-0 w-44 h-14 bg-white dark:bg-[#0E0E0E]" />
        </div>

        {/* Text content — layered on top */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center py-16 min-h-[calc(100vh-73px)]">
          {/* Badge */}
          <div ref={badgeRef} className="flex items-center gap-2.5 mb-12">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Available for Freelance
            </span>
          </div>

          {/* Name + Side content */}
          <div className="grid lg:grid-cols-[1fr,320px] gap-12 items-end">
            <div>
              <h1
                ref={shammiRef}
                className="font-display font-black leading-[0.9] tracking-tight text-neutral-900 dark:text-white"
                style={{ fontSize: 'clamp(72px, 14vw, 180px)' }}
              >
                SHAMMI
              </h1>
              <h1
                ref={thapaRef}
                className="font-display font-black leading-[0.9] tracking-tight text-primary"
                style={{ fontSize: 'clamp(72px, 14vw, 180px)' }}
              >
                THAPA
              </h1>
            </div>

            {/* Side: bio + CTAs + socials */}
            <div ref={sideRef} className="pb-3">
              <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mb-8">
                WordPress &amp; Shopify Developer with 10+ years of experience.
                Delivering pixel-perfect, high-performance websites for clients
                worldwide.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-primary text-[#0E0E0E] text-sm font-bold px-6 py-3 rounded-full hover:bg-primary-light transition-colors"
                >
                  Hire Me <HiArrowRight size={15} />
                </a>
                <a
                  href="/shammi-thapa-cv.pdf"
                  className="inline-flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-semibold px-6 py-3 rounded-full hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <HiDownload size={15} /> Download CV
                </a>
              </div>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div ref={statsRef} className="flex flex-wrap gap-12 mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
              : stats.map((s) => (
                  <div key={s.id}>
                    <p className="font-display text-4xl font-bold text-neutral-900 dark:text-white">
                      {s.value}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Marquee stripe */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...stripe, ...stripe, ...stripe, ...stripe].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 px-8 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
