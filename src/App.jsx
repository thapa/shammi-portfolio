import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import { ScrollTrigger } from './lib/gsap'
import CustomCursor from './components/global/CustomCursor'
import Header from './components/global/Header'
import Hero from './components/global/home/Hero'
import Hero2 from './components/global/home/Hero2'
import TechPartners from './components/global/home/TechPartners'
import About from './components/global/home/About'
import Services from './components/global/home/Services'
import Process from './components/global/home/Process'
import Projects from './components/global/home/Projects'
import Contact from './components/global/home/Contact'
import Footer from './components/global/Footer'
import ChatWidget from './components/global/ChatWidget'
import AdminApp from './admin/AdminApp'

// ── Portfolio site ────────────────────────────────────────────────────────────
function Portfolio() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const toggleTheme = () => setDark((d) => !d)

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 500)
    return () => clearTimeout(id)
  }, [])

  return (
    <ContentProvider>
      <CustomCursor />
      <Header isDark={dark} toggleTheme={toggleTheme} />
      <main>
        {/* <Hero /> */}
        <Hero2 />
        <About />
        <Services />
        <Process />
        <TechPartners />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </ContentProvider>
  )
}

// ── Root with routing ─────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
