import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { isVideoUrl } from '../../lib/cloudinary'
import {
  HiPlus, HiPencil, HiTrash, HiRefresh,
  HiExternalLink, HiChevronUp, HiChevronDown,
} from 'react-icons/hi'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table'

// ── Screenshot status badge ───────────────────────────────────────────────────
const SsBadge = ({ status, errorMsg }) => {
  if (status === 'idle')       return <span className="text-xs text-slate-400">—</span>
  if (status === 'generating') return <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-600 animate-pulse">Generating</Badge>
  if (status === 'done')       return <Badge variant="outline" className="text-[10px] border-green-300 text-green-600">Done</Badge>
  if (status === 'error')      return <Badge variant="destructive" className="text-[10px]" title={errorMsg || 'Error'}>Failed</Badge>
  return null
}

// ── Generate screenshots ──────────────────────────────────────────────────────
const generateScreenshots = async (projectId, url, onStatus) => {
  for (const type of ['desktop', 'mobile']) {
    onStatus(type, 'generating', null)
    try {
      const res = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, url, type }),
      })
      if (!res.ok) {
        let msg = `HTTP ${res.status}`
        try { const j = await res.json(); msg = j.error || msg } catch {}
        onStatus(type, 'error', msg)
      } else {
        onStatus(type, 'done', null)
      }
    } catch (err) {
      onStatus(type, 'error', err.message || 'Network error')
    }
  }
}

// ── Projects panel ────────────────────────────────────────────────────────────
const ProjectsPanel = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [regen, setRegen]       = useState({})
  const [moving, setMoving]     = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('display_order', { ascending: true })
    setProjects((data || []).map((p, i) => ({ ...p, display_order: i + 1 })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const regenerate = async (project) => {
    setRegen(prev => ({ ...prev, [project.id]: { desktop: { status: 'generating' }, mobile: { status: 'idle' } } }))
    await generateScreenshots(project.id, project.url, (type, status, errorMsg) => {
      setRegen(prev => ({ ...prev, [project.id]: { ...prev[project.id], [type]: { status, errorMsg } } }))
    })
    load()
  }

  // The form page hands off screenshot generation on save, so progress shows
  // here in the row instead of dying with the unmounted form.
  const handedOff = useRef(new Set())

  useEffect(() => {
    const target = location.state?.generateFor
    if (!target?.id || handedOff.current.has(target.id)) return
    handedOff.current.add(target.id)
    navigate(location.pathname, { replace: true, state: null })  // don't re-fire on refresh
    regenerate(target)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(p => p.filter(x => x.id !== id))
  }

  const moveProject = async (index, dir) => {
    const j = index + dir
    setMoving(index)
    const updated = [...projects]
    ;[updated[index], updated[j]] = [updated[j], updated[index]]
    updated[index] = { ...updated[index], display_order: index + 1 }
    updated[j]     = { ...updated[j],     display_order: j + 1 }
    setProjects(updated)
    await Promise.all([
      supabase.from('projects').update({ display_order: index + 1 }).eq('id', updated[index].id),
      supabase.from('projects').update({ display_order: j + 1 }).eq('id', updated[j].id),
    ])
    setMoving(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-900 text-2xl font-bold">Projects</h1>
          <p className="text-slate-400 text-sm mt-0.5">{projects.length} total · Cloudinary screenshots auto-generate on add</p>
        </div>
        <Button
          onClick={() => navigate('/admin/projects/new')}
          className="bg-primary text-primary-foreground hover:bg-primary-light gap-1.5"
        >
          <HiPlus size={15} /> Add Project
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-4 flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-8 w-12 rounded" />
                <Skeleton className="h-8 flex-1 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">No projects yet.</p>
            <button onClick={() => navigate('/admin/projects/new')} className="mt-3 text-primary text-sm hover:underline">
              Add the first one
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-16 text-xs font-semibold uppercase tracking-wider text-slate-400">Order</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">Title</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">Slug / URL</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">Case Study</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">Media</TableHead>
                <TableHead className="w-28 text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p, index) => {
                const rs = regen[p.id] || {}
                const isSaving = moving === index || moving === index - 1 || moving === index + 1
                const desktopIsVideo = isVideoUrl(p.screenshot_url)
                const thumbIsVideo = isVideoUrl(p.thumbnail_url)

                return (
                  <TableRow key={p.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveProject(index, -1)}
                          disabled={index === 0 || isSaving}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <HiChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => moveProject(index, 1)}
                          disabled={index === projects.length - 1 || isSaving}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <HiChevronDown size={14} />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-800 font-medium">{p.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-medium">{p.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        {p.slug && (
                          <span className="text-xs text-slate-400 font-mono">/project/{p.slug}</span>
                        )}
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline text-xs flex items-center gap-1 max-w-[160px] truncate"
                        >
                          {p.url} <HiExternalLink size={11} className="flex-shrink-0" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      {p.case_study_type ? (
                        <Badge
                          className={`text-xs ${
                            p.case_study_type === 'cro'
                              ? 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100'
                              : 'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100'
                          }`}
                          variant="outline"
                        >
                          {p.case_study_type === 'cro' ? 'CRO' : 'Web'}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 w-14">Thumbnail</span>
                          <span className={`text-[10px] font-medium ${p.thumbnail_url ? 'text-green-600' : 'text-slate-300'}`}>
                            {p.thumbnail_url ? (thumbIsVideo ? 'Video' : 'Image') : 'None'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 w-14">Desktop</span>
                          {rs.desktop ? (
                            <SsBadge status={rs.desktop.status} errorMsg={rs.desktop.errorMsg} />
                          ) : (
                            <span className={`text-[10px] font-medium ${p.screenshot_url ? 'text-green-600' : 'text-slate-300'}`}>
                              {p.screenshot_url ? (desktopIsVideo ? 'Video' : 'Image') : 'None'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 w-14">Mobile</span>
                          {rs.mobile ? (
                            <SsBadge status={rs.mobile.status} errorMsg={rs.mobile.errorMsg} />
                          ) : (
                            <span className={`text-[10px] font-medium ${p.mobile_screenshot_url ? 'text-green-600' : 'text-slate-300'}`}>
                              {p.mobile_screenshot_url ? 'Image' : 'None'}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/admin/projects/${p.id}/edit`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <HiPencil size={14} />
                        </button>
                        <button
                          onClick={() => regenerate(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Regenerate screenshots"
                        >
                          <HiRefresh size={14} />
                        </button>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <HiTrash size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export default ProjectsPanel
