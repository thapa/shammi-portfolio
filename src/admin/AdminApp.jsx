import { useState, useLayoutEffect } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import ProjectsPanel from './panels/ProjectsPanel'
import ProjectForm from './panels/ProjectForm'
import TablePanel from './panels/TablePanel'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
  HiViewGrid, HiCog, HiStar, HiBriefcase, HiChartBar, HiClipboardList,
  HiLogout, HiExternalLink,
} from 'react-icons/hi'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

const NAV = [
  { key: 'projects',   label: 'Projects',      Icon: HiViewGrid },
  { key: 'services',   label: 'Services',       Icon: HiCog },
  { key: 'skills',     label: 'Skills',         Icon: HiStar },
  { key: 'experience', label: 'Experience',     Icon: HiBriefcase },
  { key: 'stats',      label: 'Stats',          Icon: HiChartBar },
  { key: 'process',    label: 'Process Steps',  Icon: HiClipboardList },
]

// ── Login gate ────────────────────────────────────────────────────────────────
const LoginGate = ({ onAuth }) => {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { onAuth() }
    else { setError(true); setPw('') }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Shammi Portfolio CMS</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Password
            </label>
            <Input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              placeholder="Enter password"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2">Incorrect password.</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary-light transition-colors"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}

// ── Admin shell ───────────────────────────────────────────────────────────────
const AdminApp = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1')

  useLayoutEffect(() => {
    document.body.classList.add('is-admin')
    const html = document.documentElement
    const hadDark = html.classList.contains('dark')
    html.classList.remove('dark')
    return () => {
      document.body.classList.remove('is-admin')
      if (hadDark) html.classList.add('dark')
    }
  }, [])

  if (!authed) return (
    <LoginGate onAuth={() => { sessionStorage.setItem('admin_auth', '1'); setAuthed(true) }} />
  )

  const logout = () => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-slate-100">
          <a href="/" className="font-display text-slate-900 font-bold text-lg leading-none block">
            Shammi.
          </a>
          <p className="text-slate-400 text-xs mt-1">Content Management</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {NAV.map(({ key, label, Icon }) => (
            <NavLink
              key={key}
              to={`/admin/${key}`}
              className={({ isActive }) =>
                `w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} className={isActive ? 'text-violet-500' : 'text-slate-400'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <HiExternalLink size={13} />
            View site
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <HiLogout size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route index element={<Navigate to="/admin/projects" replace />} />

            <Route path="projects" element={<ProjectsPanel />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />

            <Route
              path="services"
              element={
                <TablePanel
                  table="services"
                  title="Services"
                  fields={[
                    { key: 'num',         label: 'Number',      placeholder: '01' },
                    { key: 'title',       label: 'Title' },
                    { key: 'description', label: 'Description', type: 'textarea' },
                    { key: 'tags',        label: 'Tags',        type: 'tags', placeholder: 'WordPress, WooCommerce' },
                  ]}
                  displayCols={['num','title']}
                />
              }
            />
            <Route
              path="skills"
              element={
                <TablePanel
                  table="skills"
                  title="Skills"
                  fields={[{ key: 'name', label: 'Skill Name' }]}
                  displayCols={['name']}
                />
              }
            />
            <Route
              path="experience"
              element={
                <TablePanel
                  table="experience"
                  title="Experience"
                  fields={[
                    { key: 'role',        label: 'Role' },
                    { key: 'company',     label: 'Company' },
                    { key: 'period',      label: 'Period',       placeholder: '2020 – Present' },
                    { key: 'description', label: 'Description',  type: 'textarea' },
                  ]}
                  displayCols={['role','company','period']}
                />
              }
            />
            <Route
              path="stats"
              element={
                <TablePanel
                  table="stats"
                  title="Stats"
                  fields={[
                    { key: 'label', label: 'Label', placeholder: 'Projects Completed' },
                    { key: 'value', label: 'Value', placeholder: '200+' },
                  ]}
                  displayCols={['label','value']}
                />
              }
            />
            <Route
              path="process"
              element={
                <TablePanel
                  table="process_steps"
                  title="Process Steps"
                  fields={[
                    { key: 'num',         label: 'Step Number', placeholder: '01' },
                    { key: 'title',       label: 'Title' },
                    { key: 'description', label: 'Description', type: 'textarea' },
                  ]}
                  displayCols={['num','title']}
                />
              }
            />

            <Route path="*" element={<Navigate to="/admin/projects" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default AdminApp
