import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ContentContext = createContext(null)

export const ContentProvider = ({ children }) => {
  const [data, setData] = useState({
    stats: [],
    skills: [],
    experience: [],
    services: [],
    processSteps: [],
    projects: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [stats, skills, experience, services, processSteps, projects] =
          await Promise.all([
            supabase.from('stats').select('*').order('display_order'),
            supabase.from('skills').select('*').order('display_order'),
            supabase.from('experience').select('*').order('display_order'),
            supabase.from('services').select('*').order('display_order'),
            supabase.from('process_steps').select('*').order('display_order'),
            supabase.from('projects').select('*').order('display_order'),
          ])

        setData({
          stats: stats.data ?? [],
          skills: skills.data ?? [],
          experience: experience.data ?? [],
          services: services.data ?? [],
          processSteps: processSteps.data ?? [],
          projects: projects.data ?? [],
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  return (
    <ContentContext.Provider value={{ ...data, loading, error }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
