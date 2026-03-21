import { useState, useEffect } from 'react'
import ProjectsPanel from './panels/ProjectsPanel'
import TablePanel from './panels/TablePanel'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

const NAV = [
  { key: 'projects',  label: 'Projects' },
  { key: 'services',  label: 'Services' },
  { key: 'skills',    label: 'Skills' },
  { key: 'experience',label: 'Experience' },
  { key: 'stats',     label: 'Stats' },
  { key: 'process',   label: 'Process Steps' },
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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Admin Panel</h1>
        <p className="text-neutral-500 text-sm mb-8">Shammi Portfolio CMS</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false) }}
            placeholder="Enter password"
            autoFocus
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          />
          {error && <p className="text-red-400 text-xs">Incorrect password</p>}
          <button
            type="submit"
            className="bg-primary text-[#0E0E0E] font-bold text-sm py-3 rounded-full hover:bg-primary-light transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Admin shell ───────────────────────────────────────────────────────────────
const AdminApp = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1')
  const [active, setActive] = useState('projects')

  useEffect(() => {
    document.body.classList.add('is-admin')
    return () => document.body.classList.remove('is-admin')
  }, [])

  if (!authed) return (
    <LoginGate onAuth={() => { sessionStorage.setItem('admin_auth', '1'); setAuthed(true) }} />
  )

  const logout = () => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col flex-shrink-0">
        <div className="px-5 py-6 border-b border-neutral-800">
          <a href="/" className="font-display text-white font-bold text-lg">Shammi.</a>
          <p className="text-neutral-600 text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === key
                  ? 'bg-primary/15 text-primary'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-neutral-800">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        {active === 'projects'   && <ProjectsPanel />}
        {active === 'services'   && (
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
        )}
        {active === 'skills' && (
          <TablePanel
            table="skills"
            title="Skills"
            fields={[{ key: 'name', label: 'Skill Name' }]}
            displayCols={['name']}
          />
        )}
        {active === 'experience' && (
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
        )}
        {active === 'stats' && (
          <TablePanel
            table="stats"
            title="Stats"
            fields={[
              { key: 'label', label: 'Label', placeholder: 'Projects Completed' },
              { key: 'value', label: 'Value', placeholder: '200+' },
            ]}
            displayCols={['label','value']}
          />
        )}
        {active === 'process' && (
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
        )}
      </main>
    </div>
  )
}

export default AdminApp
