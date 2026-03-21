import { useState } from 'react'
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle, HiArrowRight } from 'react-icons/hi'

const contactInfo = [
  {
    Icon: HiMail,
    label: 'Email',
    value: 'thapa.shammi@gmail.com',
    href: 'mailto:thapa.shammi@gmail.com',
  },
  {
    Icon: HiPhone,
    label: 'Phone',
    value: '+91 9988191688',
    href: 'tel:+919988191688',
  },
  {
    Icon: HiLocationMarker,
    label: 'Location',
    value: 'India',
    href: null,
  },
]

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="bg-[#0E0E0E] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Large display heading */}
        <div className="mb-20">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-600 mb-6">
            Get In Touch
          </p>
          <h2 className="font-display font-black leading-none text-white">
            <span
              className="block"
              style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}
            >
              Get in
            </span>
            <span
              className="block text-primary"
              style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}
            >
              touch.
            </span>
          </h2>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <div>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10">
              I&apos;m available for freelance projects. Whether it&apos;s a new
              WordPress build, Shopify store, or anything web-related — let&apos;s
              talk!
            </p>

            <div className="flex flex-col gap-6">
              {contactInfo.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 uppercase tracking-widest font-semibold mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-white hover:text-primary transition-colors font-medium"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <HiCheckCircle size={48} className="text-primary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-neutral-400 text-sm">
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm text-primary font-semibold hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-[#0E0E0E] text-sm font-bold px-6 py-3 rounded-full hover:bg-primary-light transition-colors cursor-pointer"
                >
                  Send Message <HiArrowRight size={16} />
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
