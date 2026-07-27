import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { isVideoUrl, uploadToCloudinary, openCloudinaryWidget } from '../../lib/cloudinary'
import { HiPlus, HiMinus, HiX, HiArrowLeft, HiUpload, HiPhotograph } from 'react-icons/hi'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Skeleton } from '../../components/ui/skeleton'
import { Checkbox } from '../../components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select'

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

// ── Section label divider ─────────────────────────────────────────────────────
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

// ── Fail-safe Media Upload Widget (File Picker + Cloudinary Widget + URL input) ──
const MediaUploadWidget = ({
  label,
  value,
  onSelectUrl,
  onRemove,
  targetType = 'desktop',
  helpText = '',
}) => {
  const isVideo = isVideoUrl(value)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const isMobile = targetType === 'mobile'
  const acceptTypes = isMobile ? 'image/*' : 'image/*,video/*'

  // Direct Device File Picker Handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (isMobile && file.type.startsWith('video/')) {
      alert('Mobile screenshots must be an Image only.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadToCloudinary(file, { targetType })
      if (url) onSelectUrl(url)
    } catch (err) {
      setUploadError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Cloudinary Widget Popup Handler
  const handleOpenWidget = () => {
    openCloudinaryWidget({
      targetType,
      onSuccess: (url) => {
        onSelectUrl(url)
      },
      onError: (err) => {
        alert(`Cloudinary Widget Error: ${err.message || err}`)
      },
    })
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-2">
          {isVideo ? (
            <video src={value} autoPlay loop muted playsInline className="w-full h-36 object-cover" />
          ) : (
            <img src={value} alt={label} className="w-full h-36 object-cover" />
          )}
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-colors z-10"
            title="Remove"
          >
            <HiX size={13} />
          </button>
        </div>
      ) : (
        <div className="w-full rounded-xl border-2 border-dashed border-slate-300 p-4 bg-slate-50/50 flex flex-col items-center justify-center gap-3">
          {uploading ? (
            <div className="flex items-center gap-2 text-primary font-medium text-xs py-3">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              Uploading to Cloudinary…
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary text-white hover:bg-primary-light gap-1.5 text-xs font-semibold px-4"
                >
                  <HiUpload size={14} /> Upload File from Device
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleOpenWidget}
                  className="gap-1.5 text-xs font-semibold px-4 border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <HiPhotograph size={14} /> Cloudinary Library / Widget
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                {isMobile ? 'Supports Images only (PNG, JPG, WebP)' : 'Supports Images or Videos (MP4, WebM, WebP, JPG)'}
              </p>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-red-500 text-xs mt-1.5 bg-red-50 border border-red-100 px-2.5 py-1.5 rounded">
          {uploadError}
        </p>
      )}

      <div className="flex gap-2 items-center mt-2">
        <Input
          type="text"
          className="h-8 text-xs font-mono"
          placeholder="Or paste Cloudinary / media URL..."
          value={value || ''}
          onChange={(e) => onSelectUrl(e.target.value)}
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs px-2 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            Change
          </Button>
        )}
      </div>
      {helpText && <p className="text-xs text-slate-400 mt-1">{helpText}</p>}
    </div>
  )
}

// ── CRO image upload widget ───────────────────────────────────────────────────
const CroImageUpload = ({ label, value, onSelectUrl, onRemove }) => {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file, { targetType: 'desktop' })
      if (url) onSelectUrl(url)
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 mb-2">
          <img src={value} alt={label} className="w-full h-24 object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <HiX size={11} />
          </button>
        </div>
      ) : (
        <div className="w-full rounded-lg border-2 border-dashed border-slate-300 p-3 bg-slate-50/50 flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <span className="text-xs text-slate-400">Uploading…</span>
          ) : (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => fileInputRef.current?.click()}>
                Upload File
              </Button>
              <Button type="button" variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => openCloudinaryWidget({ targetType: 'desktop', onSuccess: onSelectUrl })}>
                Widget
              </Button>
            </div>
          )}
        </div>
      )}
      <Input
        type="text"
        className="h-8 text-xs font-mono mt-1"
        placeholder="Or paste URL..."
        value={value || ''}
        onChange={(e) => onSelectUrl(e.target.value)}
      />
    </div>
  )
}

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

// ── Form body — mounted only once the project (if editing) is in hand ─────────
const ProjectFormFields = ({ project }) => {
  const navigate = useNavigate()
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
  const [saveError, setSaveError]     = useState('')
  const [generating, setGenerating]   = useState(false)

  // Media URLs stored directly (from File upload, Cloudinary Upload Widget or URL input)
  const [thumbnailUrl, setThumbnailUrl] = useState(isEdit ? project?.thumbnail_url : '')
  const [desktopUrl, setDesktopUrl]     = useState(isEdit ? project?.screenshot_url : '')
  const [mobileUrl, setMobileUrl]       = useState(isEdit ? project?.mobile_screenshot_url : '')

  // CRO Before / After image URLs
  const [beforeUrl, setBeforeUrl]       = useState(isEdit ? (csd.before_image_url || '') : '')
  const [afterUrl, setAfterUrl]         = useState(isEdit ? (csd.after_image_url || '') : '')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleTitleChange = (val) => {
    set('title', val)
    if (!isEdit && !form.slug) set('slug', toSlug(val))
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
    setSaveError('')

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
      thumbnail_url:          thumbnailUrl ? thumbnailUrl.trim() : null,
      screenshot_url:         desktopUrl   ? desktopUrl.trim()   : null,
      mobile_screenshot_url:  mobileUrl    ? mobileUrl.trim()    : null,
    }

    try {
      if (form.case_study_type === 'cro') {
        payload.case_study_data = buildCaseStudyData(
          form,
          testMetrics,
          beforeUrl ? beforeUrl.trim() : null,
          afterUrl ? afterUrl.trim() : null
        )
      } else {
        payload.case_study_data = null
      }

      let savedId = project?.id

      if (isEdit) {
        const { error } = await supabase.from('projects').update(payload).eq('id', project.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('projects').insert(payload).select('id').single()
        if (error) throw error
        savedId = data?.id
      }

      // Auto-generate screenshots if no desktop screenshot/media provided and URL changed
      const urlChanged = !isEdit || form.url.trim() !== project?.url
      const shouldGenerate = !!savedId && !!payload.url && !desktopUrl && urlChanged

      setSaving(false)
      navigate('/admin/projects', {
        replace: true,
        state: shouldGenerate ? { generateFor: { id: savedId, url: payload.url } } : null,
      })
    } catch (err) {
      setSaving(false)
      setSaveError(err.message || 'Could not save this project.')
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="mb-6">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors mb-3"
        >
          <HiArrowLeft size={13} /> Back to projects
        </Link>
        <h1 className="text-slate-900 text-2xl font-bold">
          {isEdit ? 'Edit Project' : 'Add Project'}
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          {isEdit ? project.title : 'Screenshots auto-generate once saved via Cloudinary'}
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">

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

        {/* Custom thumbnail (Image or Video) */}
        <MediaUploadWidget
          label="Custom Card Thumbnail (Image or Video)"
          value={thumbnailUrl}
          targetType="desktop"
          onSelectUrl={setThumbnailUrl}
          onRemove={() => setThumbnailUrl('')}
          helpText="Overrides desktop screenshot on portfolio card. Upload image or video."
        />

        {/* Media / Screenshot section */}
        <FormSection label="Desktop & Mobile Screenshots" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Desktop Screenshot / Video */}
          <MediaUploadWidget
            label="Desktop Screenshot / Video"
            value={desktopUrl}
            targetType="desktop"
            onSelectUrl={setDesktopUrl}
            onRemove={() => setDesktopUrl('')}
            helpText="Supports Image or Video (.mp4, .webm). Uploading replaces auto-generated screenshot."
          />

          {/* Mobile Screenshot (Image ONLY) */}
          <MediaUploadWidget
            label="Mobile Screenshot (Image Only)"
            value={mobileUrl}
            targetType="mobile"
            onSelectUrl={(url) => {
              if (isVideoUrl(url)) {
                alert('Mobile screenshot must be an image only.')
                return
              }
              setMobileUrl(url)
            }}
            onRemove={() => setMobileUrl('')}
            helpText="Mobile screenshot must be an Image only."
          />
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
              value={beforeUrl}
              onSelectUrl={setBeforeUrl}
              onRemove={() => setBeforeUrl('')}
            />
            <CroImageUpload
              label="After (Variant)"
              value={afterUrl}
              onSelectUrl={setAfterUrl}
              onRemove={() => setAfterUrl('')}
            />
          </div>
        </>)}

        {saveError && (
          <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {saveError}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-slate-100 mt-2">
          <Button
            type="submit"
            disabled={saving}
            className="flex-1 mt-4 bg-primary text-primary-foreground hover:bg-primary-light"
          >
            {saving ? 'Saving Project…' : isEdit ? 'Save Changes' : 'Add Project'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/projects')}
            className="px-5 mt-4"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

// ── Route entry — resolves :id before mounting the form ───────────────────────
const ProjectForm = () => {
  const { id } = useParams()
  const isEdit = !!id

  const [project, setProject] = useState(null)
  const [status, setStatus]   = useState(isEdit ? 'loading' : 'ready')

  useEffect(() => {
    if (!isEdit) { setStatus('ready'); return }

    let cancelled = false
    setStatus('loading')

    ;(async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
      if (cancelled) return
      if (error || !data) { setStatus('missing'); return }
      setProject(data)
      setStatus('ready')
    })()

    return () => { cancelled = true }
  }, [id, isEdit])

  if (status === 'loading') {
    return (
      <div className="max-w-3xl flex flex-col gap-4">
        <Skeleton className="h-8 w-48 rounded" />
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded" />)}
        </div>
      </div>
    )
  }

  if (status === 'missing') return <Navigate to="/admin/projects" replace />

  return <ProjectFormFields key={project?.id || 'new'} project={project} />
}

export default ProjectForm
