import { useState, useEffect, useRef } from 'react'
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle, HiArrowRight } from 'react-icons/hi'
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { gsap, SplitText } from '../../../lib/gsap'

const contactInfo = [
  { Icon: HiMail, label: 'Email', value: 'thapa.shammi@gmail.com', href: 'mailto:thapa.shammi@gmail.com' },
  { Icon: HiPhone, label: 'Phone', value: '+91 9988191688', href: 'tel:+919988191688' },
  { Icon: HiLocationMarker, label: 'Location', value: 'India', href: null },
]

const socials = [
  { Icon: FaGithub,    label: 'GitHub',    href: 'https://github.com/shammithapa' },
  { Icon: FaLinkedin,  label: 'LinkedIn',  href: 'https://linkedin.com/in/shammithapa' },
  { Icon: FaXTwitter,  label: 'X',         href: 'https://x.com/shammithapa' },
  { Icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com/shammithapa' },
  { Icon: FaYoutube,   label: 'YouTube',   href: 'https://youtube.com/@shammithapa' },
]

const budgetOptions = [
  'Under $500',
  '$500 – $1,000',
  '$1,000 – $5,000',
  '$5,000 – $10,000',
  '$10,000+',
]

const projectTypeOptions = [
  'WordPress Development',
  'Shopify Development',
  'Web Development',
  'E-commerce Store',
  'Website Redesign',
  'Other',
]

const inputClass =
  'w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-primary transition-colors'

const labelClass =
  'text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 block mb-2'

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    projectType: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const infoRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { start: 'top 82%', once: true }

      gsap.from(labelRef.current, {
        y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: labelRef.current, ...st },
      })

      // Big display chars
      const split1 = new SplitText(line1Ref.current, { type: 'chars' })
      const split2 = new SplitText(line2Ref.current, { type: 'chars' })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: line1Ref.current, ...st },
      })
      tl.from(split1.chars, { y: 80, opacity: 0, duration: 0.8, stagger: 0.025, ease: 'power3.out' })
        .from(split2.chars, { y: 80, opacity: 0, duration: 0.8, stagger: 0.025, ease: 'power3.out' }, '-=0.55')

      // Contact info items
      const infoItems = infoRef.current?.children
      if (infoItems?.length) {
        gsap.from(infoItems, {
          x: -28, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%', once: true },
        })
      }

      // Form panel
      gsap.from(formRef.current, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`)

      setStatus('sent')
      setForm({ name: '', email: '', phone: '', budget: '', projectType: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err.message.includes('JSON')
          ? 'API not available locally — deploy to Vercel or run: vercel dev'
          : err.message
      )
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden bg-white dark:bg-[#0E0E0E] py-24 md:py-32 transition-colors duration-300">
      {/* BG decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(#5c51fe 1px, transparent 1px), linear-gradient(90deg, #5c51fe 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Large display heading */}
        <div className="mb-20">
          <p ref={labelRef} className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-6">
            Get In Touch
          </p>
          <h2 className="font-display font-black leading-none text-white">
            <span ref={line1Ref} className="block text-neutral-900 dark:text-white" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>
              Get in
            </span>
            <span ref={line2Ref} className="block text-primary" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>
              touch.
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: contact info */}
          <div>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed mb-10">
              I&apos;m available for freelance projects. Whether it&apos;s a new
              WordPress build, Shopify store, or anything web-related — let&apos;s
              talk!
            </p>
            <div ref={infoRef} className="flex flex-col gap-6">
              {contactInfo.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-semibold mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="text-neutral-900 dark:text-white hover:text-primary transition-colors font-medium">
                        {value}
                      </a>
                    ) : (
                      <p className="text-neutral-900 dark:text-white font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                {socials.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div ref={formRef} className="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl p-8">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <HiCheckCircle size={48} className="text-primary mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm text-primary font-semibold hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className={labelClass}>Phone Number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 234 567 8900"
                    className={inputClass}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-budget" className={labelClass}>Budget</label>
                    <select
                      id="contact-budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      required
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="" disabled className="bg-white dark:bg-neutral-900">
                        Select budget
                      </option>
                      {budgetOptions.map((o) => (
                        <option key={o} value={o} className="bg-white dark:bg-neutral-900">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-type" className={labelClass}>Project Type</label>
                    <select
                      id="contact-type"
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      required
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="" disabled className="bg-white dark:bg-neutral-900">
                        Select type
                      </option>
                      {projectTypeOptions.map((o) => (
                        <option key={o} value={o} className="bg-white dark:bg-neutral-900">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {status === 'error' && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending…' : <>Send Message <HiArrowRight size={16} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
