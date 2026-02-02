'use client'
import { useEffect, useState } from 'react'
import { supabase, Provider } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const PROPERTIES = [
  'Villa Magna 253 A',
  'Villa Magna 253 B', 
  'Nitta 102',
  'Mismaloya 7202',
  'Mismaloya 5705',
  'Avida 408',
  'Cielo 101'
]

export default function NewIncident() {
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    property_name: '',
    reporter_type: 'huesped',
    reporter_name: '',
    reporter_contact: '',
    category: 'plomeria',
    description: '',
    urgency: 'normal',
    provider_id: ''
  })

  useEffect(() => {
    supabase.from('providers').select('*').eq('active', true).then(({ data }) => setProviders(data || []))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const { data, error } = await supabase.from('incidents').insert([{
      ...form,
      provider_id: form.provider_id || null,
      status: form.provider_id ? 'asignado' : 'nuevo'
    }]).select().single()

    if (error) {
      alert('Error: ' + error.message)
      setLoading(false)
      return
    }

    // Add initial update
    await supabase.from('incident_updates').insert([{
      incident_id: data.id,
      message: 'Incident created',
      status_change: form.provider_id ? 'asignado' : 'nuevo',
      created_by: 'system'
    }])

    router.push(`/incidents/${data.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/incidents" className="flex items-center gap-2 text-gray-600 hover:text-castle-dark mb-6">
        <ArrowLeft size={20} />
        Back to Incidents
      </Link>

      <div className="card">
        <h1 className="text-2xl font-semibold text-castle-dark mb-6">New Incident</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
              <select required className="w-full border rounded-lg px-4 py-2"
                value={form.property_name} onChange={e => setForm({...form, property_name: e.target.value})}>
                <option value="">Select property...</option>
                {PROPERTIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required className="w-full border rounded-lg px-4 py-2"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="plomeria">🔧 Plumbing</option>
                <option value="electricidad">⚡ Electrical</option>
                <option value="limpieza">🧹 Cleaning</option>
                <option value="ac">❄️ AC</option>
                <option value="otro">📦 Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required rows={4} className="w-full border rounded-lg px-4 py-2"
              placeholder="Describe the issue..."
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Type</label>
              <select className="w-full border rounded-lg px-4 py-2"
                value={form.reporter_type} onChange={e => setForm({...form, reporter_type: e.target.value})}>
                <option value="huesped">Guest</option>
                <option value="propietario">Owner</option>
                <option value="cs">CS Team</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Name</label>
              <input type="text" className="w-full border rounded-lg px-4 py-2"
                value={form.reporter_name} onChange={e => setForm({...form, reporter_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="Phone or email"
                value={form.reporter_contact} onChange={e => setForm({...form, reporter_contact: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select className="w-full border rounded-lg px-4 py-2"
                value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})}>
                <option value="baja">🟢 Low</option>
                <option value="normal">🔵 Normal</option>
                <option value="alta">🟠 High</option>
                <option value="urgente">🔴 Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Provider</label>
              <select className="w-full border rounded-lg px-4 py-2"
                value={form.provider_id} onChange={e => setForm({...form, provider_id: e.target.value})}>
                <option value="">Not assigned yet</option>
                {providers.filter(p => p.category === form.category || p.category === 'general').map(p => 
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                )}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/incidents" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
