import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiPlus, HiPencil, HiTrash, HiChevronUp, HiChevronDown } from 'react-icons/hi'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Skeleton } from '../../components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../../components/ui/dialog'

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
          : form[f.key],
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
    <Dialog open onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="max-w-md bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4 pt-2">
          {fields.map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <Label htmlFor={f.key} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {f.label}
                {f.type === 'tags' && (
                  <span className="normal-case font-normal opacity-60 ml-1">(comma-separated)</span>
                )}
              </Label>
              {f.type === 'textarea' ? (
                <Textarea
                  id={f.key}
                  rows={3}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder || ''}
                  className="resize-none text-sm"
                />
              ) : (
                <Input
                  id={f.key}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder || ''}
                  className="text-sm"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary-light"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : `Add ${title}`}
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

// ── Generic table panel ───────────────────────────────────────────────────────
const TablePanel = ({ table, title, fields, displayCols }) => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [moving, setMoving] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from(table).select('*').order('display_order', { ascending: true })
    setRows((data || []).map((r, i) => ({ ...r, display_order: i + 1 })))
    setLoading(false)
  }

  useEffect(() => { load() }, [table])

  const deleteRow = async (id) => {
    if (!confirm(`Delete this ${title.toLowerCase().replace(/s$/, '')}?`)) return
    await supabase.from(table).delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
  }

  const displayValue = (row, col) => {
    const v = row[col]
    if (Array.isArray(v)) return v.join(', ')
    return v ?? '—'
  }

  const moveRow = async (index, dir) => {
    const j = index + dir
    setMoving(index)
    const updated = [...rows]
    ;[updated[index], updated[j]] = [updated[j], updated[index]]
    updated[index] = { ...updated[index], display_order: index + 1 }
    updated[j] = { ...updated[j], display_order: j + 1 }
    setRows(updated)
    await Promise.all([
      supabase.from(table).update({ display_order: index + 1 }).eq('id', updated[index].id),
      supabase.from(table).update({ display_order: j + 1 }).eq('id', updated[j].id),
    ])
    setMoving(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-900 text-2xl font-bold">{title}</h1>
          <p className="text-slate-400 text-sm mt-0.5">{rows.length} {rows.length === 1 ? 'entry' : 'entries'}</p>
        </div>
        <Button
          onClick={() => setModal('add')}
          className="bg-primary text-primary-foreground hover:bg-primary-light gap-1.5"
        >
          <HiPlus size={15} />
          Add {title.replace(/s$/, '')}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-4 flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-8 w-12 rounded" />
                <Skeleton className="h-8 flex-1 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">No entries yet.</p>
            <button
              onClick={() => setModal('add')}
              className="mt-3 text-primary text-sm hover:underline"
            >
              Add the first one
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-16 text-xs font-semibold uppercase tracking-wider text-slate-400">Order</TableHead>
                {displayCols.map(col => (
                  <TableHead key={col} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {col.replace(/_/g, ' ')}
                  </TableHead>
                ))}
                <TableHead className="w-24 text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => {
                const isSaving = moving === index || moving === index - 1 || moving === index + 1
                return (
                  <TableRow key={row.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveRow(index, -1)}
                          disabled={index === 0 || isSaving}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <HiChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => moveRow(index, 1)}
                          disabled={index === rows.length - 1 || isSaving}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <HiChevronDown size={14} />
                        </button>
                      </div>
                    </TableCell>
                    {displayCols.map((col, ci) => (
                      <TableCell
                        key={col}
                        className={`text-sm ${ci === 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}
                      >
                        <span className="line-clamp-1">{displayValue(row, col)}</span>
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModal(row)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <HiPencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteRow(row.id)}
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
