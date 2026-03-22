import { useEffect, useRef } from 'react'
import { gsap } from '../../../lib/gsap'
import { SiShopify } from 'react-icons/si'
import { FaHeart, FaRecycle } from 'react-icons/fa'
import { HiCog } from 'react-icons/hi'

// ─── Individual logo renderers ────────────────────────────────────────────────

const LogoShopify = () => (
  <div className="flex items-center gap-2">
    <SiShopify size={20} className="text-[#96bf48]" />
    <span className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">
      shopify
    </span>
  </div>
)

const LogoShopifyPlus = () => (
  <div className="flex items-center gap-1.5">
    <SiShopify size={17} className="text-[#96bf48]" />
    <span className="text-[14px] font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">
      shopify
    </span>
    <span className="text-[14px] italic font-bold text-neutral-400 dark:text-neutral-500 tracking-tight">
      plus
    </span>
  </div>
)

const LogoVWO = () => (
  <svg width="58" height="22" viewBox="0 0 58 22" fill="none" className="shrink-0">
    <text x="0" y="18" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" fill="currentColor" className="text-neutral-800 dark:text-neutral-200">
      VWO
    </text>
    {/* arc accent above the O */}
    <path d="M44 4 Q51 -1 58 4" stroke="#8b5cf6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
)

const LogoJudgeMe = () => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded bg-[#1f2937] flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xs font-black">J</span>
    </div>
    <span className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-200">
      Judge.me
    </span>
  </div>
)

const LogoKlaviyo = () => (
  <div className="flex items-center gap-0.5">
    <span className="text-[16px] font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">
      klaviyo
    </span>
    <span className="text-primary font-black text-lg leading-none mb-2">*</span>
  </div>
)

const LogoLionWheel = () => (
  <div className="flex items-center gap-2">
    <HiCog size={20} className="text-neutral-500 dark:text-neutral-400" />
    <span className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-200">
      LionWheel
    </span>
  </div>
)

const LogoLoloyal = () => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded-md bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
      <FaHeart size={11} className="text-white" />
    </div>
    <span className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-200">
      Loloyal
    </span>
  </div>
)

const LogoGelato = () => (
  <div className="flex items-center gap-2">
    {/* Diamond / gem shape */}
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <polygon points="9,1 17,7 9,17 1,7" fill="#10b981" opacity="0.9" />
      <polygon points="9,1 17,7 9,9" fill="#34d399" />
    </svg>
    <span className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-200">
      Gelato
    </span>
  </div>
)

const LogoYotpo = () => (
  <span className="text-[18px] font-black text-[#f97316] tracking-tight">
    yotpo.
  </span>
)

const LogoRecharge = () => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <FaRecycle size={12} className="text-primary" />
    </div>
    <span className="text-[15px] font-semibold text-[#5c51fe]">
      recharge
    </span>
  </div>
)

// ─── Partner grid data ────────────────────────────────────────────────────────
const partners = [
  { id: 'shopify',      Logo: LogoShopify },
  { id: 'shopifyplus',  Logo: LogoShopifyPlus },
  { id: 'vwo',          Logo: LogoVWO },
  { id: 'judgeme',      Logo: LogoJudgeMe },
  { id: 'klaviyo',      Logo: LogoKlaviyo },
  { id: 'lionwheel',    Logo: LogoLionWheel },
  { id: 'loloyal',      Logo: LogoLoloyal },
  { id: 'gelato',       Logo: LogoGelato },
  { id: 'yotpo',        Logo: LogoYotpo },
  { id: 'recharge',     Logo: LogoRecharge },
]

// ─── Component ────────────────────────────────────────────────────────────────
const TechPartners = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const gridRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current.children, {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
      })

      gsap.from(gridRef.current.children, {
        opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.05, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 88%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-white dark:bg-[#0E0E0E] py-20 md:py-28 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headingRef} className="mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
            Partners
          </p>
          <h2
            className="font-display font-black text-neutral-900 dark:text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
          >
            Working with the{' '}
            <span className="text-primary">best tech.</span>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-sm">
            Working with a variety of successful partners in the Shopify
            ecosystem, to provide the best possible results across multiple
            services.
          </p>
        </div>

        {/* Logo grid — seamless bordered cells */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-t border-l border-neutral-200 dark:border-neutral-800"
        >
          {partners.map(({ id, Logo }) => (
            <div
              key={id}
              className="border-r border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-center py-8 px-6 group hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-200"
            >
              <Logo />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechPartners
