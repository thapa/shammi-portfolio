import { useState } from 'react'
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const Header = ({ isDark, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0E0E0E]/90 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="font-display text-xl font-bold text-neutral-900 dark:text-white tracking-tight"
        >
          Shammi.
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <HiSun size={16} /> : <HiMoon size={16} />}
          </button>
          <a
            href="#contact"
            className="hidden md:inline-flex bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-primary-light transition-colors"
          >
            Hire Me
          </a>
          <button
            className="md:hidden text-neutral-900 dark:text-white"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0E0E0E] border-t border-neutral-200 dark:border-neutral-800 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-full text-center hover:bg-primary-light transition-colors"
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
