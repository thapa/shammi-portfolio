const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const Footer = () => {
  return (
    <footer className="bg-[#0E0E0E] border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="#home" className="font-display text-white font-bold text-lg">
          Shammi.
        </a>
        <nav className="flex flex-wrap justify-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-neutral-600 text-xs hover:text-neutral-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-neutral-700 text-xs">
          &copy; {new Date().getFullYear()} Shammi Thapa. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
