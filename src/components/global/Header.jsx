import { useState, useEffect } from 'react'
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const Header = ({ isDark, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--ds-bg)' : 'transparent',
        opacity: scrolled ? 0.96 : 1,
        borderBottom: scrolled ? '1px solid var(--ds-border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex items-center justify-between" style={{ height: '76px' }}>
        {/* Logo */}
        <a
          href="#home"
          className="font-display text-xs tracking-[0.12em] uppercase"
          style={{ color: 'var(--ds-text-1)' }}
        >
          Shammi Thapa
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-[0.75rem] tracking-[0.04em] transition-colors duration-150"
              style={{ color: 'var(--ds-text-3)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--ds-text-1)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--ds-text-3)'}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center transition-colors duration-150"
            style={{
              border: '1px solid var(--ds-border)',
              color: 'var(--ds-text-3)',
              background: 'transparent',
            }}
            aria-label="Toggle theme"
          >
            {isDark ? <HiSun size={15} /> : <HiMoon size={15} />}
          </button>
          <a
            href="#contact"
            className="hidden md:inline-flex btn-primary"
          >
            Hire Me
          </a>
          <button
            className="md:hidden"
            style={{ color: 'var(--ds-text-1)' }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 py-6 flex flex-col gap-5"
          style={{
            background: 'var(--ds-bg)',
            borderTop: '1px solid var(--ds-border)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--ds-text-2)' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn-primary w-full text-center"
            onClick={() => setMenuOpen(false)}
          >
            Hire Me
          </a>
        </div>
      )}
    </header>
  )
}

export default Header
