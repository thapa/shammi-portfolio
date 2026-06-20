import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import {
  HiPlus, HiPencil, HiTrash, HiRefresh, HiX,
  HiExternalLink, HiChevronUp, HiChevronDown, HiMinus,
} from 'react-icons/hi'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { Checkbox } from '../../components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../../components/ui/dialog'

const CATEGORIES = ['WordPress', 'Shopify', 'React', 'Other']

const EMPTY_FORM = {
  title: '', category: 'WordPress', url: '', description: '', tech_stack: '',
  slug: '', client_name: '', case_study_type: '',
  timeline: '', challenge: '', approach: '', outcome: '',
  duration: '', role: '',
  results_headline: '', results_cta: '',
  testimonial_quote: '', testimonial_author: '', testimonial_role: '',
  cs_engagement: '', cs_window: '', cs_tests_shipped: '',
  cs_section_number: '01', cs_section_title: '', cs_test_id: '', cs_test_duration: '',
  cs_hypothesis: '', cs_fix: '',
}

const toSlug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

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

// ── Section label divider inside modal ───────────────────────────────────────
const FormSection = ({ label }) => (
  <div className="flex items-center gap-3 pt-1">
    <div className="h-px flex-1 bg-slate-200" />
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
    <div className="h-px flex-1 bg-slate-200" />
  </div>
)

// ── Field label ───────────────────────────────────────────────────────────────
const FieldLabel = ({ htmlFor, children }) => (
  <Label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">
    {children}
  </Label>
)

// ── Dynamic metrics list ──────────────────────────────────────────────────────
const MetricsList = ({ metrics, onChange, showAccent = false }) => {
  const add = () => onChange([...metrics, { label: '', value: '', ...(showAccent ? { accent: false } : {}) }])
  const remove = (i) => onChange(metrics.filter((_, idx) => idx !== i))
  const update = (i, field, val) => onChange(metrics.map((m, idx) => idx === i ? { ...m, [field]: val } : m))

  return (
    <div className="flex flex-col gap-2">
      {metrics.map((m, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            className="flex-1 h-8 text-xs"
            placeholder="Label (e.g. Conversion Rate)"
            value={m.label}
            onChange={e => update(i, 'label', e.target.value)}
          />
          <Input
            className="w-24 h-8 text-xs"
            placeholder="Value"
            value={m.value}
            onChange={e => update(i, 'value', e.target.value)}
          />
          {showAccent && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Checkbox
                id={`accent-${i}`}
                checked={!!m.accent}
                onCheckedChange={v => update(i, 'accent', v)}
              />
              <label htmlFor={`accent-${i}`} className="text-[10px] text-slate-500 cursor-pointer select-none">Accent</label>
            </div>
          )}
          <button
            type="button"
            onClick={() => remove(i)}
            className="w-7 h-7 flex-shrink-0 rounded flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <HiMinus size={12} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-70 transition-opacity w-fit"
      >
        <HiPlus size={12} /> Add Metric
      </button>
    </div>
  )
}

// ── CRO image upload widget ───────────────────────────────────────────────────
const CroImageUpload = ({ label, preview, inputRef, onChange, onRemove }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {preview ? (
      <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
        <img src={preview} alt={label} className="w-full h-24 object-cover" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <HiX size={11} />
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full h-24 rounded-lg border-2 border-dashed border-slate-300 hover:border-primary/60 hover:bg-violet-50/30 transition-colors flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary"
      >
        <span className="text-base font-light">+</span>
        <span className="text-[10px] font-medium">Upload</span>
      </button>
    )}
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
  </div>
)

// ── Build case_study_data JSONB ───────────────────────────────────────────────
function buildCaseStudyData(form, testMetrics, beforeUrl, afterUrl) {
  return {
    engagement:     form.cs_engagement     || null,
    window:         form.cs_window         || null,
    tests_shipped:  form.cs_tests_shipped  || null,
    section_number: form.cs_section_number || '01',
    section_title:  form.cs_section_title  || null,
    test_id:        form.cs_test_id        || null,
    test_duration:  form.cs_test_duration  || null,
    hypothesis:     form.cs_hypothesis     || null,
    fix:            form.cs_fix            || null,
    test_metrics:   testMetrics.filter(m => m.label || m.value),
    before_image_url: beforeUrl,
    after_image_url:  afterUrl,
  }
}

// ── Project modal ─────────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose, onSaved }) => {
  const isEdit = !!project?.id
  const csd = project?.case_study_data || {}

  const [form, setForm] = useState(isEdit ? {
    title:              project.title || '',
    category:           project.category || 'WordPress',
    url:                project.url || '',
    description:        project.description || '',
    tech_stack:         (project.tech_stack || []).join(', '),
    slug:               project.slug || '',
    client_name:        project.client_name || '',
    case_study_type:    project.case_study_type || '',
    timeline:           project.timeline || '',
    challenge:          project.challenge || '',
    approach:           project.approach || '',
    outcome:            project.outcome || '',
    duration:           project.duration || '',
    role:               project.role || '',
    results_headline:   project.results_headline || '',
    results_cta:        project.results_cta || '',
    testimonial_quote:  project.testimonial_quote || '',
    testimonial_author: project.testimonial_author || '',
    testimonial_role:   project.testimonial_role || '',
    cs_engagement:      csd.engagement     || '',
    cs_window:          csd.window         || '',
    cs_tests_shipped:   csd.tests_shipped  || '',
    cs_section_number:  csd.section_number || '01',
    cs_section_title:   csd.section_title  || '',
    cs_test_id:         csd.test_id        || '',
    cs_test_duration:   csd.test_duration  || '',
    cs_hypothesis:      csd.hypothesis     || '',
    cs_fix:             csd.fix            || '',
  } : EMPTY_FORM)

  const [metrics, setMetrics]         = useState(isEdit ? (project.metrics || []) : [])
  const [testMetrics, setTestMetrics] = useState(isEdit ? (csd.test_metrics || []) : [])
  const [saving, setSaving]           = useState(false)
  const [generating, setGenerating]   = useState(false)
  const [ssStatus, setSsStatus]       = useState({ desktop: { status: 'idle' }, mobile: { status: 'idle' } })

  const [thumbnailFile, setThumbnailFile]         = useState(null)
  const [thumbnailPreview, setThumbnailPreview]   = useState(isEdit ? project?.thumbnail_url : null)
  const [beforeFile, setBeforeFile]               = useState(null)
  const [afterFile, setAfterFile]                 = useState(null)
  const [beforePreview, setBeforePreview]         = useState(isEdit ? (csd.before_image_url || null) : null)
  const [afterPreview, setAfterPreview]           = useState(isEdit ? (csd.after_image_url || null) : null)

  const fileInputRef   = useRef(null)
  const beforeInputRef = useRef(null)
  const afterInputRef  = useRef(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleTitleChange = (val) => {
    set('title', val)
    if (!isEdit && !form.slug) set('slug', toSlug(val))
  }

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

  const uploadCroImage = async (file, projectId, name) => {
    if (!file) return null
    const ext = file.name.split('.').pop()
    const path = `${projectId}/${name}.${ext}`
    await supabase.storage.from('project-screenshots').upload(path, file, { upsert: true })
    const { data: urlData } = supabase.storage.from('project-screenshots').getPublicUrl(path)
    return urlData.publicUrl
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title:       form.title.trim(),
      category:    form.category,
      url:         form.url.trim(),
      description: form.description.trim(),
      tech_stack:  form.tech_stack ? form.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [],
      slug:            form.slug.trim() || toSlug(form.title.trim()),
      client_name:     form.client_name.trim() || null,
      case_study_type: form.case_study_type || null,
      timeline:           form.timeline.trim() || null,
      challenge:          form.challenge.trim() || null,
      approach:           form.approach.trim() || null,
      outcome:            form.outcome.trim() || null,
      duration:           form.duration.trim() || null,
      role:               form.role.trim() || null,
      results_headline:   form.results_headline.trim() || null,
      results_cta:        form.results_cta.trim() || null,
      testimonial_quote:  form.testimonial_quote.trim() || null,
      testimonial_author: form.testimonial_author.trim() || null,
      testimonial_role:   form.testimonial_role.trim() || null,
      metrics: metrics.filter(m => m.label || m.value),
    }

    let savedId = project?.id

    if (isEdit) {
      if (thumbnailFile) {
        const ext = thumbnailFile.name.split('.').pop()
        const path = `${savedId}/custom-thumbnail.${ext}`
        await supabase.storage.from('project-screenshots').upload(path, thumbnailFile, { upsert: true })
        const { data: urlData } = supabase.storage.from('project-screenshots').getPublicUrl(path)
        payload.thumbnail_url = urlData.publicUrl
      } else if (thumbnailPreview === null && project?.thumbnail_url) {
        payload.thumbnail_url = null
      }

      if (form.case_study_type === 'cro') {
        const beforeUrl = beforeFile ? await uploadCroImage(beforeFile, savedId, 'cs-before') : (beforePreview || null)
        const afterUrl  = afterFile  ? await uploadCroImage(afterFile,  savedId, 'cs-after')  : (afterPreview  || null)
        payload.case_study_data = buildCaseStudyData(form, testMetrics, beforeUrl, afterUrl)
      } else {
        payload.case_study_data = null
      }

      await supabase.from('projects').update(payload).eq('id', project.id)
    } else {
      const { data } = await supabase.from('projects').insert(payload).select('id').single()
      savedId = data?.id

      if (savedId && thumbnailFile) {
        const ext = thumbnailFile.name.split('.').pop()
        const path = `${savedId}/custom-thumbnail.${ext}`
        await supabase.storage.from('project-screenshots').upload(path, thumbnailFile, { upsert: true })
        const { data: urlData } = supabase.storage.from('project-screenshots').getPublicUrl(path)
        await supabase.from('projects').update({ thumbnail_url: urlData.publicUrl }).eq('id', savedId)
      }

      if (savedId && form.case_study_type === 'cro') {
        const beforeUrl = beforeFile ? await uploadCroImage(beforeFile, savedId, 'cs-before') : null
        const afterUrl  = afterFile  ? await uploadCroImage(afterFile,  savedId, 'cs-after')  : null
        await supabase.from('projects').update({
          case_study_data: buildCaseStudyData(form, testMetrics, beforeUrl, afterUrl),
        }).eq('id', savedId)
      }
    }

    setSaving(false)
    onSaved()

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
    <Dialog open onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Project' : 'Add Project'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4 pt-2">

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                required
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Heritage Store"
              />
            </div>
            <div>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="url">URL</FieldLabel>
            <Input
              id="url"
              required
              type="url"
              value={form.url}
              onChange={e => set('url', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {/* Custom thumbnail */}
          <div>
            <FieldLabel>Custom Thumbnail</FieldLabel>
            {thumbnailPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <HiX size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/60 hover:bg-violet-50/30 transition-colors flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-primary"
              >
                <span className="text-lg font-light">+</span>
                <span className="text-xs font-medium">Upload image</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
            <p className="text-xs text-slate-400 mt-1.5">Overrides auto-generated desktop screenshot</p>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generating || !form.title}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating
                  ? <><span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" /> Generating…</>
                  : <>AI Generate</>}
              </button>
            </div>
            <Textarea
              id="description"
              className="resize-none text-sm"
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief project description…"
            />
          </div>

          <div>
            <FieldLabel htmlFor="tech_stack">
              Tech Stack <span className="normal-case font-normal opacity-60 ml-1">(comma-separated)</span>
            </FieldLabel>
            <Input
              id="tech_stack"
              value={form.tech_stack}
              onChange={e => set('tech_stack', e.target.value)}
              placeholder="WordPress, WooCommerce, Elementor"
            />
          </div>

          {/* Screenshot status */}
          {(ssStatus.desktop.status !== 'idle' || ssStatus.mobile.status !== 'idle') && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Desktop</span>
                <SsBadge status={ssStatus.desktop.status} errorMsg={ssStatus.desktop.errorMsg} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Mobile</span>
                <SsBadge status={ssStatus.mobile.status} errorMsg={ssStatus.mobile.errorMsg} />
              </div>
            </div>
          )}

          {/* Case Study section */}
          <FormSection label="Case Study" />

          <div>
            <FieldLabel htmlFor="case_study_type">Template</FieldLabel>
            <Select value={form.case_study_type || '__none__'} onValueChange={v => set('case_study_type', v === '__none__' ? '' : v)}>
              <SelectTrigger id="case_study_type">
                <SelectValue placeholder="None — no case study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None — no case study</SelectItem>
                <SelectItem value="web">Web Project</SelectItem>
                <SelectItem value="cro">CRO / A-B Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.case_study_type && (<>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  id="slug"
                  className="font-mono text-xs"
                  value={form.slug}
                  onChange={e => set('slug', toSlug(e.target.value))}
                  placeholder="project-name"
                />
                <p className="text-[10px] text-slate-400 mt-1">/project/{form.slug || 'your-slug'}</p>
              </div>
              <div>
                <FieldLabel htmlFor="client_name">Client Name</FieldLabel>
                <Input
                  id="client_name"
                  value={form.client_name}
                  onChange={e => set('client_name', e.target.value)}
                  placeholder="Brew & Bloom Coffee"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="timeline">Timeline</FieldLabel>
                <Input id="timeline" value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="Q1 2024 — 8 Weeks" />
              </div>
              <div>
                <FieldLabel htmlFor="duration">Duration</FieldLabel>
                <Input id="duration" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="8 Weeks" />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="role">Role / Engagement</FieldLabel>
              <Input id="role" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Design & Development" />
            </div>

            <div>
              <FieldLabel htmlFor="challenge">The Challenge</FieldLabel>
              <Textarea id="challenge" className="resize-none text-sm" rows={3} value={form.challenge} onChange={e => set('challenge', e.target.value)} placeholder="What problem did the client have?" />
            </div>

            <div>
              <FieldLabel htmlFor="approach">The Approach</FieldLabel>
              <Textarea id="approach" className="resize-none text-sm" rows={3} value={form.approach} onChange={e => set('approach', e.target.value)} placeholder="How did you solve it?" />
            </div>

            <div>
              <FieldLabel htmlFor="outcome">Outcome</FieldLabel>
              <Textarea id="outcome" className="resize-none text-sm" rows={2} value={form.outcome} onChange={e => set('outcome', e.target.value)} placeholder="What was the result?" />
            </div>

            <FormSection label="Results Section" />

            <div>
              <FieldLabel htmlFor="results_headline">Results Headline</FieldLabel>
              <Input id="results_headline" value={form.results_headline} onChange={e => set('results_headline', e.target.value)} placeholder="Six weeks. One launch. Zero compromises." />
            </div>

            <div>
              <FieldLabel htmlFor="results_cta">Results CTA</FieldLabel>
              <Input id="results_cta" value={form.results_cta} onChange={e => set('results_cta', e.target.value)} placeholder="Start a Project" />
            </div>

            <div>
              <FieldLabel>Result Metrics</FieldLabel>
              <MetricsList metrics={metrics} onChange={setMetrics} />
            </div>

            <FormSection label="Testimonial" />

            <div>
              <FieldLabel htmlFor="testimonial_quote">Quote</FieldLabel>
              <Textarea id="testimonial_quote" className="resize-none text-sm" rows={3} value={form.testimonial_quote} onChange={e => set('testimonial_quote', e.target.value)} placeholder="What did the client say?" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="testimonial_author">Author Name</FieldLabel>
                <Input id="testimonial_author" value={form.testimonial_author} onChange={e => set('testimonial_author', e.target.value)} placeholder="Sarah Chen" />
              </div>
              <div>
                <FieldLabel htmlFor="testimonial_role">Author Role</FieldLabel>
                <Input id="testimonial_role" value={form.testimonial_role} onChange={e => set('testimonial_role', e.target.value)} placeholder="Owner, Brew & Bloom" />
              </div>
            </div>
          </>)}

          {/* CRO-specific fields */}
          {form.case_study_type === 'cro' && (<>
            <FormSection label="CRO Details" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="cs_engagement">Engagement</FieldLabel>
                <Input id="cs_engagement" value={form.cs_engagement} onChange={e => set('cs_engagement', e.target.value)} placeholder="Full-Funnel, CRO" />
              </div>
              <div>
                <FieldLabel htmlFor="cs_window">Window</FieldLabel>
                <Input id="cs_window" value={form.cs_window} onChange={e => set('cs_window', e.target.value)} placeholder="Q2 – Q3 2023" />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="cs_tests_shipped">Tests Shipped</FieldLabel>
              <Input id="cs_tests_shipped" value={form.cs_tests_shipped} onChange={e => set('cs_tests_shipped', e.target.value)} placeholder="11 / 16 Winners" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="cs_section_title">Section Title</FieldLabel>
                <Input id="cs_section_title" value={form.cs_section_title} onChange={e => set('cs_section_title', e.target.value)} placeholder="Homepage Hero" />
              </div>
              <div>
                <FieldLabel htmlFor="cs_test_id">Test ID</FieldLabel>
                <Input id="cs_test_id" value={form.cs_test_id} onChange={e => set('cs_test_id', e.target.value)} placeholder="Home Hero Test #3" />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="cs_test_duration">Test Duration</FieldLabel>
              <Input id="cs_test_duration" value={form.cs_test_duration} onChange={e => set('cs_test_duration', e.target.value)} placeholder="18 Days" />
            </div>

            <div>
              <FieldLabel htmlFor="cs_hypothesis">Hypothesis</FieldLabel>
              <Textarea id="cs_hypothesis" className="resize-none text-sm" rows={3} value={form.cs_hypothesis} onChange={e => set('cs_hypothesis', e.target.value)} placeholder="Why did you think this test would win?" />
            </div>

            <div>
              <FieldLabel htmlFor="cs_fix">The Fix</FieldLabel>
              <Textarea id="cs_fix" className="resize-none text-sm" rows={3} value={form.cs_fix} onChange={e => set('cs_fix', e.target.value)} placeholder="What changes did the variant include?" />
            </div>

            <div>
              <FieldLabel>Test Metrics</FieldLabel>
              <MetricsList metrics={testMetrics} onChange={setTestMetrics} showAccent={true} />
              <p className="text-[10px] text-slate-400 mt-1">Check "Accent" on the final metric to highlight it (e.g. SHIPPED)</p>
            </div>

            <FormSection label="Compare Slider Images" />

            <div className="grid grid-cols-2 gap-4">
              <CroImageUpload
                label="Before (Control)"
                preview={beforePreview}
                inputRef={beforeInputRef}
                onChange={e => { const f = e.target.files?.[0]; if (f) { setBeforeFile(f); setBeforePreview(URL.createObjectURL(f)) } }}
                onRemove={() => { setBeforeFile(null); setBeforePreview(null); if (beforeInputRef.current) beforeInputRef.current.value = '' }}
              />
              <CroImageUpload
                label="After (Variant)"
                preview={afterPreview}
                inputRef={afterInputRef}
                onChange={e => { const f = e.target.files?.[0]; if (f) { setAfterFile(f); setAfterPreview(URL.createObjectURL(f)) } }}
                onRemove={() => { setAfterFile(null); setAfterPreview(null); if (afterInputRef.current) afterInputRef.current.value = '' }}
              />
            </div>
          </>)}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary-light"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Project'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="px-5">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Projects panel ────────────────────────────────────────────────────────────
const ProjectsPanel = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [regen, setRegen]       = useState({})
  const [moving, setMoving]     = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('display_order', { ascending: true })
    setProjects((data || []).map((p, i) => ({ ...p, display_order: i + 1 })))
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
          <p className="text-slate-400 text-sm mt-0.5">{projects.length} total · Screenshots auto-generate on add</p>
        </div>
        <Button
          onClick={() => setModal('add')}
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
            <button onClick={() => setModal('add')} className="mt-3 text-primary text-sm hover:underline">
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
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">Screenshots</TableHead>
                <TableHead className="w-28 text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p, index) => {
                const rs = regen[p.id] || {}
                const isSaving = moving === index || moving === index - 1 || moving === index + 1
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
                            {p.thumbnail_url ? 'Custom' : 'None'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 w-14">Desktop</span>
                          {rs.desktop
                            ? <SsBadge status={rs.desktop.status} errorMsg={rs.desktop.errorMsg} />
                            : <span className={`text-[10px] font-medium ${p.screenshot_url ? 'text-green-600' : 'text-slate-300'}`}>{p.screenshot_url ? 'Saved' : 'None'}</span>
                          }
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 w-14">Mobile</span>
                          {rs.mobile
                            ? <SsBadge status={rs.mobile.status} errorMsg={rs.mobile.errorMsg} />
                            : <span className={`text-[10px] font-medium ${p.mobile_screenshot_url ? 'text-green-600' : 'text-slate-300'}`}>{p.mobile_screenshot_url ? 'Saved' : 'None'}</span>
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModal(p)}
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
