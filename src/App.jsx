import { useState, useEffect } from 'react'
import { ContentProvider } from './context/ContentContext'
import CustomCursor from './components/global/CustomCursor'
import Header from './components/global/Header'
import Hero from './components/global/home/Hero'
import About from './components/global/home/About'
import Services from './components/global/home/Services'
import Process from './components/global/home/Process'
import Projects from './components/global/home/Projects'
import Contact from './components/global/home/Contact'
import Footer from './components/global/Footer'

function App() {
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

  return (
    <ContentProvider>
      <CustomCursor />
      <Header isDark={dark} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ContentProvider>
  )
}

export default App
