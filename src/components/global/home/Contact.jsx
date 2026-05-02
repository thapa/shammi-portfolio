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
  { label: 'LinkedIn', href: 'https://linkedin.com/in/shammithapa' },
  { label: 'GitHub', href: 'https://github.com/shammithapa' },
  { label: 'Twitter', href: 'https://x.com/shammithapa' },
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

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    projectType: '',
  })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const headingRef = useRef(null)
  const infoRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { start: 'top 82%', once: true }

      gsap.from(labelRef.current, {
        y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: labelRef.current, ...st },
      })

      const split = new SplitText(headingRef.current, { type: 'words' })
      gsap.from(split.words, {
        y: 48, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, ...st },
      })

      const infoItems = infoRef.current?.children
      if (infoItems?.length) {
        gsap.from(infoItems, {
          x: -28, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%', once: true },
        })
      }

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
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden py-24 md:py-32 transition-colors duration-300"
      style={{ background: 'var(--ds-bg)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Heading */}
        <div className="mb-10">
          <p ref={labelRef} className="section-label mb-6">
            Contact
          </p>
          <h2
            ref={headingRef}
            className="section-heading mb-4"
          >
            Have a project in mind?
          </h2>
          <p
            className="body-text mb-10"
          >
            Currently taking on new projects. I reply within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,460px] gap-16 items-start">
          {/* Left: contact info */}
          <div>

            <div ref={infoRef} className="flex flex-col gap-6">
              {contactInfo.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                    style={{ border: '1px solid var(--ds-border)', color: 'var(--ds-accent)' }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-[0.6875rem] uppercase tracking-widest font-medium mb-0.5" style={{ color: 'var(--ds-text-3)' }}>
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="font-medium transition-colors duration-150"
                        style={{ color: 'var(--ds-text-1)' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--ds-accent)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--ds-text-1)'}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium" style={{ color: 'var(--ds-text-1)' }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social links — text only, no icons (one-accent purity) */}
              <div className="flex gap-6 pt-4" style={{ borderTop: '1px solid var(--ds-border)' }}>
                {socials.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[0.8125rem] tracking-[0.04em] transition-colors duration-150"
                    style={{ color: 'var(--ds-text-3)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--ds-text-1)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--ds-text-3)'}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div
            ref={formRef}
            style={{
              background: 'var(--ds-bg-surface)',
              border: '1px solid var(--ds-border)',
            }}
          >
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center p-8">
                <div
                  className="w-11 h-11 flex items-center justify-center mb-4 text-xl"
                  style={{ border: '1px solid var(--ds-accent)', color: 'var(--ds-accent)' }}
                >
                  ✓
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--ds-text-1)' }}>Message Sent</h3>
                <p className="text-sm" style={{ color: 'var(--ds-text-2)' }}>
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm font-medium cursor-pointer transition-colors"
                  style={{ color: 'var(--ds-accent)' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col p-8" style={{ gap: '20px' }}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="section-label">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="form-input"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="section-label">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="form-input"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-phone" className="section-label">Phone</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 234 567 8900"
                    className="form-input"
                  />
                </div>

                <div className="grid sm:grid-cols-2" style={{ gap: '20px' }}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-budget" className="section-label">Budget</label>
                    <select
                      id="contact-budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      required
                      className="form-input cursor-pointer"
                    >
                      <option value="" disabled>Select budget</option>
                      {budgetOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-type" className="section-label">Project Type</label>
                    <select
                      id="contact-type"
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      required
                      className="form-input cursor-pointer"
                    >
                      <option value="" disabled>Select type</option>
                      {projectTypeOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {status === 'error' && (
                  <p className="text-sm" style={{ color: 'oklch(55% 0.15 25)' }}>{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ marginTop: '8px' }}
                >
                  {status === 'sending' ? 'Sending…' : <>Send Message <HiArrowRight size={14} /></>}
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
