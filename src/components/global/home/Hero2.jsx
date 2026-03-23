import { useState, useEffect } from 'react'
import { HiArrowRight } from 'react-icons/hi'
import { SiShopify, SiWordpress } from 'react-icons/si'
import { useContent } from '../../../context/ContentContext'
import { getOrFetchScreenshot } from '../../../lib/screenshotbase'

// ─── Single project card with real screenshot ─────────────────────────────────
const ProjectCard = ({ project }) => {
  const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSrc(null)
    setError(false)
    getOrFetchScreenshot(project)
      .then((url) => { if (!cancelled) { setSrc(url); setLoading(false) } })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false) } })
    return () => { cancelled = true }
  }, [project.id])

  return (
    <div className="w-[260px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex-shrink-0">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <div className="ml-2 flex-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded text-[10px] text-neutral-400 flex items-center px-2 truncate">
          {project.url?.replace(/^https?:\/\/(www\.)?/, '') || 'project.com'}
        </div>
      </div>

      {/* Screenshot area */}
      <div className="relative h-[168px] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        {/* Fallback title — always underneath */}
        <div className="absolute inset-0 flex items-end p-4">
          <span className="text-neutral-400 dark:text-neutral-600 font-display font-bold text-xl leading-none select-none">
            {project.title}
          </span>
        </div>

        {/* Screenshot fades in */}
        {!error && (
          <img
            src={src ?? undefined}
            alt={project.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${src && !loading ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Shimmer while loading */}
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{project.title}</span>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
          project.category === 'Shopify'
            ? 'bg-[#5c51fe]/10 text-[#5c51fe]'
            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
        }`}>
          {project.category}
        </span>
      </div>
    </div>
  )
}

// ─── Scrolling column ─────────────────────────────────────────────────────────
const ScrollColumn = ({ projects, direction }) => {
  // Duplicate for seamless loop — need enough cards to fill viewport height
  // Repeat until we have at least 8 items, then double
  let padded = [...projects]
  while (padded.length < 6) padded = [...padded, ...projects]
  const doubled = [...padded, ...padded]

  return (
    <div className="relative overflow-hidden flex-shrink-0 w-[280px]" style={{ height: '100vh' }}>
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white dark:from-[#0E0E0E] to-transparent z-10 pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white dark:from-[#0E0E0E] to-transparent z-10 pointer-events-none" />

      {/* Scrolling track */}
      <div className={direction === 'down' ? 'animate-scroll-down' : 'animate-scroll-up'}>
        <div className="flex flex-col gap-3 py-1.5 px-3">
          {doubled.map((project, i) => (
            <ProjectCard key={`${project.id}-${i}`} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Hero2 ────────────────────────────────────────────────────────────────────
const Hero2 = () => {
  const { projects } = useContent()

  // Split projects into two columns; fall back to empty arrays until loaded
  const mid = Math.ceil(projects.length / 2)
  const leftProjects = projects.slice(0, mid)
  const rightProjects = projects.slice(mid)

  // Don't render columns until we have at least one project per side
  const showColumns = leftProjects.length > 0 && rightProjects.length > 0

  return (
    <section className="relative min-h-screen bg-white dark:bg-[#0E0E0E] overflow-hidden flex items-center transition-colors duration-300">
      <div className="w-full flex items-stretch" style={{ minHeight: '100vh' }}>

        {/* Left column — scrolls DOWN */}
        {showColumns && (
          <div className="hidden lg:block flex-shrink-0">
            <ScrollColumn projects={leftProjects} direction="down" />
          </div>
        )}

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center relative z-10">
          {/* Partner badges */}
          <div className="flex items-center gap-4 mb-8 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 dark:bg-primary/10">
              <SiShopify size={15} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Shopify Partner
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 dark:bg-primary/10">
              <SiWordpress size={15} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                WordPress Expert
              </span>
            </div>
          </div>

          {/* Heading */}
          <h2
            className="font-display font-black text-neutral-900 dark:text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}
          >
            Custom Web{' '}
            <span className="text-primary">Development.</span>
            <br />
            Built for Growth.
          </h2>

          {/* Subtitle */}
          <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed max-w-sm mb-10">
            Trusted by brands and agencies to deliver practical, effective,
            business-focused web solutions.
          </p>

          {/* CTA */}
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 bg-primary text-white text-sm font-bold px-8 py-3.5 rounded-full hover:bg-primary-light shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 uppercase tracking-widest"
          >
            Discuss Your Project <HiArrowRight size={15} />
          </a>

          {/* Stats */}
          <div className="flex items-center gap-10 mt-14 pt-10 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary">200+</p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">Projects</p>
            </div>
            <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-800" />
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary">10+</p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">Years Exp</p>
            </div>
            <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-800" />
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary">100%</p>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right column — scrolls UP */}
        {showColumns && (
          <div className="hidden lg:block flex-shrink-0">
            <ScrollColumn projects={rightProjects} direction="up" />
          </div>
        )}

      </div>
    </section>
  )
}

export default Hero2
