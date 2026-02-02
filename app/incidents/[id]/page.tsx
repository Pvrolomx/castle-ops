'use client'
import { useEffect, useState } from 'react'
import { supabase, Incident, Provider, IncidentUpdate } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'

export default function IncidentDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [updates, setUpdates] = useState<IncidentUpdate[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [newUpdate, setNewUpdate] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    const [incRes, updRes, provRes] = await Promise.all([
      supabase.from('incidents').select('*, provider:providers(*)').eq('id', id).single(),
      supabase.from('incident_updates').select('*').eq('incident_id', id).order('created_at', { ascending: true }),
      supabase.from('providers').select('*').eq('active', true)
    ])
    setIncident(incRes.data)
    setUpdates(updRes.data || [])
    setProviders(provRes.data || [])
    setNewStatus(incRes.data?.status || '')
    setLoading(false)
  }

  async function addUpdate() {
    if (!newUpdate.trim()) return
    
    const updateData: any = {
      incident_id: id,
      message: newUpdate,
      created_by: 'CS Team'
    }

    if (newStatus !== incident?.status) {
      updateData.status_change = newStatus
      await supabase.from('incidents').update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
        resolved_at: newStatus === 'resuelto' ? new Date().toISOString() : null
      }).eq('id', id)
    }

    await supabase.from('incident_updates').insert([updateData])
    setNewUpdate('')
    loadData()
  }

  async function assignProvider(providerId: string) {
    await supabase.from('incidents').update({ 
      provider_id: providerId,
      status: 'asignado',
      updated_at: new Date().toISOString()
    }).eq('id', id)

    const provider = providers.find(p => p.id === providerId)
    await supabase.from('incident_updates').insert([{
      incident_id: id,
      message: `Assigned to ${provider?.name}`,
      status_change: 'asignado',
      created_by: 'CS Team'
    }])
    loadData()
  }

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!incident) return <div className="text-center py-20">Incident not found</div>

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/incidents" className="flex items-center gap-2 text-gray-600 hover:text-castle-dark mb-6">
        <ArrowLeft size={20} />
        Back to Incidents
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-castle-dark">{incident.property_name}</h1>
                <p className="text-gray-500">{incident.category} • {new Date(incident.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium status-${incident.status}`}>
                  {incident.status}
                </span>
                <span className={`px-2 py-1 rounded text-sm urgency-${incident.urgency}`}>
                  {incident.urgency}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{incident.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-t pt-4">
              <span>👤 {incident.reporter_type}: {incident.reporter_name || 'Unknown'}</span>
              {incident.reporter_contact && <span>📞 {incident.reporter_contact}</span>}
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-lg font-semibold text-castle-dark mb-4">Timeline</h2>
            <div className="space-y-4 mb-6">
              {updates.map((update, i) => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${update.status_change ? 'bg-castle-gold' : 'bg-gray-300'}`} />
                    {i < updates.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-gray-700">{update.message}</p>
                    {update.status_change && (
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs status-${update.status_change}`}>
                        → {update.status_change}
                      </span>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {update.created_by} • {new Date(update.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Update */}
            <div className="border-t pt-4">
              <div className="flex gap-2 mb-3">
                <select className="border rounded-lg px-3 py-2 text-sm"
                  value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="nuevo">nuevo</option>
                  <option value="asignado">asignado</option>
                  <option value="en_progreso">en_progreso</option>
                  <option value="resuelto">resuelto</option>
                </select>
                {newStatus !== incident.status && (
                  <span className="text-sm text-castle-gold self-center">Status will change</span>
                )}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Add an update..." className="flex-1 border rounded-lg px-4 py-2"
                  value={newUpdate} onChange={e => setNewUpdate(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && addUpdate()} />
                <button onClick={addUpdate} className="btn-primary px-4">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-castle-dark mb-4">Provider</h2>
            {incident.provider ? (
              <div>
                <p className="font-medium">{(incident.provider as Provider).name}</p>
                <p className="text-sm text-gray-500">{(incident.provider as Provider).category}</p>
                {(incident.provider as Provider).phone && (
                  <a href={`tel:${(incident.provider as Provider).phone}`} className="text-castle-gold text-sm">
                    📞 {(incident.provider as Provider).phone}
                  </a>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-3">Not assigned yet</p>
                <select className="w-full border rounded-lg px-3 py-2"
                  onChange={e => e.target.value && assignProvider(e.target.value)}>
                  <option value="">Assign provider...</option>
                  {providers.filter(p => p.category === incident.category || p.category === 'general').map(p =>
                    <option key={p.id} value={p.id}>{p.name}</option>
                  )}
                </select>
              </div>
            )}
          </div>

          {incident.status !== 'resuelto' && (
            <button onClick={() => {
              setNewStatus('resuelto')
              setNewUpdate('Issue resolved')
              setTimeout(addUpdate, 100)
            }} className="w-full btn-primary flex items-center justify-center gap-2">
              <CheckCircle size={20} />
              Mark as Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
