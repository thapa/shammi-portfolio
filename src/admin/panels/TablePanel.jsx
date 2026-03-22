import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'

// ── Generic row modal ─────────────────────────────────────────────────────────
const RowModal = ({ row, fields, title, onClose, onSaved, table }) => {
  const isEdit = !!row?.id
  const empty = Object.fromEntries(fields.map(f => [f.key, '']))
  const [form, setForm] = useState(
    isEdit
      ? Object.fromEntries(fields.map(f => [f.key, f.type === 'tags' ? (row[f.key] || []).join(', ') : (row[f.key] ?? '')]))
      : empty
  )
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = Object.fromEntries(
      fields.map(f => [
        f.key,
        f.type === 'tags'
          ? form[f.key].split(',').map(s => s.trim()).filter(Boolean)
          : form[f.key]
      ])
    )

    if (isEdit) {
      await supabase.from(table).update(payload).eq('id', row.id)
    } else {
      await supabase.from(table).insert(payload)
    }

    setSaving(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 rounded-2xl w-full max-w-md border border-neutral-800" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
          <h2 className="text-white font-bold">{isEdit ? `Edit ${title}` : `Add ${title}`}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors"><HiX size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="admin-label">
                {f.label}
                {f.type === 'tags' && <span className="normal-case font-normal opacity-50 ml-1">(comma-separated)</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  className="admin-input resize-none"
                  rows={3}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder || ''}
                />
              ) : (
                <input
                  className="admin-input"
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder || ''}
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-white font-bold text-sm py-2.5 rounded-full hover:bg-primary-light transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : `Add ${title}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-neutral-700 text-neutral-400 text-sm hover:border-neutral-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Generic table panel ───────────────────────────────────────────────────────
const TablePanel = ({ table, title, fields, displayCols }) => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from(table).select('*').order('id', { ascending: true })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [table])

  const deleteRow = async (id) => {
    if (!confirm(`Delete this ${title.toLowerCase()}?`)) return
    await supabase.from(table).delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
  }

  const displayValue = (row, col) => {
    const v = row[col]
    if (Array.isArray(v)) return v.join(', ')
    return v ?? '—'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">{title}</h1>
          <p className="text-neutral-500 text-sm mt-0.5">{rows.length} entries</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-primary-light transition-colors"
        >
          <HiPlus size={16} /> Add {title.replace(/s$/, '')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-600 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-neutral-600 text-sm">No entries yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                {displayCols.map(col => (
                  <th key={col} className="admin-th capitalize">{col.replace(/_/g, ' ')}</th>
                ))}
                <th className="admin-th w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  {displayCols.map((col, ci) => (
                    <td key={col} className={`admin-td ${ci === 0 ? 'text-white font-medium' : 'text-neutral-400'}`}>
                      <span className="line-clamp-1">{displayValue(row, col)}</span>
                    </td>
                  ))}
                  <td className="admin-td">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setModal(row)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors"
                        title="Edit"
                      >
                        <HiPencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteRow(row.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                        title="Delete"
                      >
                        <HiTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <RowModal
          row={modal === 'add' ? null : modal}
          fields={fields}
          title={title.replace(/s$/, '')}
          table={table}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}

export default TablePanel
