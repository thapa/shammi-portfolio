import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { HiPlus, HiPencil, HiTrash, HiRefresh, HiCheck, HiX, HiExternalLink } from 'react-icons/hi'

const EMPTY = { title: '', category: 'WordPress', url: '', description: '', tech_stack: '' }
const CATEGORIES = ['WordPress', 'Shopify']

// ── Screenshot status badge ───────────────────────────────────────────────────
const SsBadge = ({ status, errorMsg }) => {
  if (status === 'idle')       return <span className="text-xs font-medium text-neutral-600">—</span>
  if (status === 'generating') return <span className="text-xs font-medium text-yellow-400 animate-pulse">Generating…</span>
  if (status === 'done')       return <span className="text-xs font-medium text-green-400">✓ Done</span>
  if (status === 'error')      return (
    <span className="text-xs font-medium text-red-400" title={errorMsg || 'Unknown error'}>
      ✗ Failed{errorMsg ? ` — ${errorMsg}` : ''}
    </span>
  )
  return null
}

// ── Generate screenshots (desktop + mobile) ───────────────────────────────────
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

// ── Project form modal ────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose, onSaved }) => {
  const isEdit = !!project?.id
  const [form, setForm] = useState(
    isEdit
      ? { ...project, tech_stack: (project.tech_stack || []).join(', ') }
      : EMPTY
  )
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [ssStatus, setSsStatus] = useState({ desktop: { status: 'idle' }, mobile: { status: 'idle' } })
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(isEdit ? project?.thumbnail_url : null)
  const fileInputRef = useRef(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const removeThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const generateDescription = async () => {
    if (!form.title) return
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, url: form.url, techStack: form.tech_stack }),
      })
      const data = await res.json()
      if (data.description) set('description', data.description)
    } catch {}
    setGenerating(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title: form.title.trim(),
      category: form.category,
      url: form.url.trim(),
      description: form.description.trim(),
      tech_stack: form.tech_stack ? form.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [],
    }

    let savedId = project?.id
    if (isEdit) {
      // Upload thumbnail now (ID is known)
      if (thumbnailFile) {
        const ext = thumbnailFile.name.split('.').pop()
        const path = `${savedId}/custom-thumbnail.${ext}`
        await supabase.storage.from('project-screenshots').upload(path, thumbnailFile, { upsert: true })
        const { data: urlData } = supabase.storage.from('project-screenshots').getPublicUrl(path)
        payload.thumbnail_url = urlData.publicUrl
      } else if (thumbnailPreview === null && project?.thumbnail_url) {
        payload.thumbnail_url = null
      }
      await supabase.from('projects').update(payload).eq('id', project.id)
    } else {
      const { data } = await supabase.from('projects').insert(payload).select('id').single()
      savedId = data?.id
      // Upload thumbnail after insert (now we have the ID)
      if (savedId && thumbnailFile) {
        const ext = thumbnailFile.name.split('.').pop()
        const path = `${savedId}/custom-thumbnail.${ext}`
        await supabase.storage.from('project-screenshots').upload(path, thumbnailFile, { upsert: true })
        const { data: urlData } = supabase.storage.from('project-screenshots').getPublicUrl(path)
        await supabase.from('projects').update({ thumbnail_url: urlData.publicUrl }).eq('id', savedId)
      }
    }

    setSaving(false)
    onSaved()

    // Auto-generate screenshots only if no custom thumbnail and URL changed
    if (savedId && payload.url && !thumbnailFile) {
      const urlChanged = !isEdit || form.url.trim() !== project.url
      if (!isEdit || urlChanged) {
        generateScreenshots(savedId, payload.url, (type, status, errorMsg) => {
          setSsStatus(prev => ({ ...prev, [type]: { status, errorMsg } }))
        })
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 rounded-2xl w-full max-w-lg border border-neutral-800 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
          <h2 className="text-white font-bold">{isEdit ? 'Edit Project' : 'Add Project'}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors"><HiX size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Title</label>
              <input required className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Heritage Store" />
            </div>
            <div>
              <label className="admin-label">Category</label>
              <select className="admin-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="admin-label">URL</label>
            <input required type="url" className="admin-input" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://example.com" />
          </div>

          {/* Custom thumbnail */}
          <div>
            <label className="admin-label">Custom Thumbnail</label>
            {thumbnailPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800">
                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                >
                  <HiX size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 rounded-xl border-2 border-dashed border-neutral-700 hover:border-primary/60 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1.5 text-neutral-500 hover:text-primary"
              >
                <span className="text-lg">+</span>
                <span className="text-xs font-medium">Upload image</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
            <p className="text-xs text-neutral-600 mt-1.5">Overrides auto-generated desktop screenshot</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="admin-label !mb-0">Description</label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generating || !form.title}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <><span className="animate-spin inline-block w-3 h-3 border border-primary border-t-transparent rounded-full" /> Generating…</>
                ) : (
                  <>✨ AI Generate</>
                )}
              </button>
            </div>
            <textarea className="admin-input resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief project description…" />
          </div>

          <div>
            <label className="admin-label">Tech Stack <span className="normal-case font-normal opacity-50">(comma-separated)</span></label>
            <input className="admin-input" value={form.tech_stack} onChange={e => set('tech_stack', e.target.value)} placeholder="WordPress, WooCommerce, Elementor" />
          </div>

          {/* Screenshot status */}
          {(ssStatus.desktop.status !== 'idle' || ssStatus.mobile.status !== 'idle') && (
            <div className="bg-neutral-800 rounded-xl p-4 flex flex-col gap-3">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Desktop</p>
                <SsBadge status={ssStatus.desktop.status} errorMsg={ssStatus.desktop.errorMsg} />
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Mobile</p>
                <SsBadge status={ssStatus.mobile.status} errorMsg={ssStatus.mobile.errorMsg} />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-white font-bold text-sm py-2.5 rounded-full hover:bg-primary-light transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Project'}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-neutral-700 text-neutral-400 text-sm hover:border-neutral-500 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Projects panel ────────────────────────────────────────────────────────────
const ProjectsPanel = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | project obj
  const [regen, setRegen] = useState({})   // { [id]: { desktop, mobile } }

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(p => p.filter(x => x.id !== id))
  }

  const regenerate = async (project) => {
    setRegen(prev => ({ ...prev, [project.id]: { desktop: { status: 'generating' }, mobile: { status: 'idle' } } }))
    await generateScreenshots(project.id, project.url, (type, status, errorMsg) => {
      setRegen(prev => ({ ...prev, [project.id]: { ...prev[project.id], [type]: { status, errorMsg } } }))
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Projects</h1>
          <p className="text-neutral-500 text-sm mt-0.5">{projects.length} total · Screenshots auto-generate on add</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-primary-light transition-colors"
        >
          <HiPlus size={16} /> Add Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-600 text-sm">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-neutral-600 text-sm">No projects yet. Add your first one!</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="admin-th">Title</th>
                <th className="admin-th">Category</th>
                <th className="admin-th">URL</th>
                <th className="admin-th">Screenshots</th>
                <th className="admin-th w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const rs = regen[p.id] || {}
                return (
                  <tr key={p.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                    <td className="admin-td font-medium text-white">{p.title}</td>
                    <td className="admin-td">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400">{p.category}</span>
                    </td>
                    <td className="admin-td">
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 max-w-[160px] truncate">
                        {p.url} <HiExternalLink size={12} className="flex-shrink-0" />
                      </a>
                    </td>
                    <td className="admin-td">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-600 w-14">Thumbnail</span>
                          <span className={`text-xs ${p.thumbnail_url ? 'text-green-400' : 'text-neutral-600'}`}>
                            {p.thumbnail_url ? '✓ Custom' : 'None'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-600 w-14">Desktop</span>
                          {rs.desktop ? <SsBadge status={rs.desktop.status} errorMsg={rs.desktop.errorMsg} /> : (
                            <span className={`text-xs ${p.screenshot_url ? 'text-green-400' : 'text-neutral-600'}`}>
                              {p.screenshot_url ? '✓ Saved' : 'None'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-600 w-14">Mobile</span>
                          {rs.mobile ? <SsBadge status={rs.mobile.status} errorMsg={rs.mobile.errorMsg} /> : (
                            <span className={`text-xs ${p.mobile_screenshot_url ? 'text-green-400' : 'text-neutral-600'}`}>
                              {p.mobile_screenshot_url ? '✓ Saved' : 'None'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="admin-td">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModal(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors"
                          title="Edit"
                        >
                          <HiPencil size={14} />
                        </button>
                        <button
                          onClick={() => regenerate(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-yellow-400 hover:bg-neutral-700 transition-colors"
                          title="Regenerate screenshots"
                        >
                          <HiRefresh size={14} />
                        </button>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                          title="Delete"
                        >
                          <HiTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ProjectModal
          project={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}

export default ProjectsPanel
