import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import { gsap, ScrollTrigger } from './lib/gsap'
import { ReactLenis } from 'lenis/react'
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
import CaseStudy from './pages/CaseStudy'

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

  const lenisRef = useRef(null)

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.08 }}>
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
    </ReactLenis>
  )
}

// ── Case Study page (same shell as Portfolio) ────────────────────────────────
function CaseStudyPage() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const lenisRef = useRef(null)

  useEffect(() => {
    function update(time) { lenisRef.current?.lenis?.raf(time * 1000) }
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 500)
    return () => clearTimeout(id)
  }, [])

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.08 }}>
      <ContentProvider>
        <CustomCursor />
        <Header isDark={dark} toggleTheme={() => setDark((d) => !d)} />
        <main>
          <CaseStudy />
        </main>
        <Footer />
      </ContentProvider>
    </ReactLenis>
  )
}

// ── Root with routing ─────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/project/:id" element={<CaseStudyPage />} />
        <Route path="/*" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
