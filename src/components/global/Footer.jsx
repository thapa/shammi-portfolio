const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const Footer = () => {
  return (
    <footer
      className="py-7 transition-colors duration-300"
      style={{
        background: 'var(--ds-bg)',
        borderTop: '1px solid var(--ds-border)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span
          className="text-sm font-medium tracking-[0.04em]"
          style={{ color: 'var(--ds-text-1)' }}
        >
          Shammi Thapa
        </span>
        <nav className="flex flex-wrap justify-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-[0.75rem] tracking-[0.04em] transition-colors duration-150"
              style={{ color: 'var(--ds-text-3)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--ds-text-2)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--ds-text-3)'}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>
          &copy; {new Date().getFullYear()} Shammi Thapa
        </p>
      </div>
    </footer>
  )
}

export default Footer
