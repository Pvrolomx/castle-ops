'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase, Provider } from '@/lib/supabase'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Provider | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', category: 'general', notes: '' })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data } = await supabase.from('providers').select('*').order('name')
    setProviders(data || [])
    setLoading(false)
  }

  function resetForm() {
    setForm({ name: '', phone: '', email: '', category: 'general', notes: '' })
    setEditing(null)
    setShowForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await supabase.from('providers').update(form).eq('id', editing.id)
    } else {
      await supabase.from('providers').insert([form])
    }
    resetForm()
    loadData()
  }

  async function toggleActive(provider: Provider) {
    await supabase.from('providers').update({ active: !provider.active }).eq('id', provider.id)
    loadData()
  }

  async function deleteProvider(id: string) {
    if (!confirm('Delete this provider?')) return
    await supabase.from('providers').delete().eq('id', id)
    loadData()
  }

  function startEdit(provider: Provider) {
    setForm({
      name: provider.name,
      phone: provider.phone || '',
      email: provider.email || '',
      category: provider.category,
      notes: provider.notes || ''
    })
    setEditing(provider)
    setShowForm(true)
  }

  const categories = [
    { value: 'plomeria', label: '🔧 Plumbing' },
    { value: 'electricidad', label: '⚡ Electrical' },
    { value: 'limpieza', label: '🧹 Cleaning' },
    { value: 'ac', label: '❄️ AC' },
    { value: 'general', label: '📦 General' }
  ]

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-castle-dark">Providers</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Provider
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={resetForm}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{editing ? 'Edit' : 'New'} Provider</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select required className="w-full border rounded-lg px-4 py-2"
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full border rounded-lg px-4 py-2"
                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full border rounded-lg px-4 py-2"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea rows={2} className="w-full border rounded-lg px-4 py-2"
                  value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.length === 0 ? (
          <div className="col-span-full card text-center py-12 text-gray-500">
            No providers yet. Add your first one!
          </div>
        ) : providers.map(provider => (
          <div key={provider.id} className={`card ${!provider.active ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-castle-dark">{provider.name}</h3>
                <span className="text-sm text-gray-500">{categories.find(c => c.value === provider.category)?.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActive(provider)} 
                  className={`p-1.5 rounded ${provider.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}>
                  <Check size={16} />
                </button>
                <button onClick={() => startEdit(provider)} className="p-1.5 rounded text-blue-600 hover:bg-blue-50">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteProvider(provider.id)} className="p-1.5 rounded text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {provider.phone && <p className="text-sm text-gray-600">📞 {provider.phone}</p>}
            {provider.email && <p className="text-sm text-gray-600">✉️ {provider.email}</p>}
            {provider.notes && <p className="text-sm text-gray-400 mt-2">{provider.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
