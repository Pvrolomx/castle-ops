'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Incident, Provider } from '@/lib/supabase'
import { ADMIN_PIN } from '@/lib/config'
import { t, Lang } from '@/lib/i18n'
import Link from 'next/link'
import { Lock, AlertTriangle, Users, CheckCircle, Clock, Plus, Search, Send } from 'lucide-react'

function AdminContent() {
  const searchParams = useSearchParams()
  const [lang] = useState<Lang>((searchParams.get('lang') as Lang) || 'es')
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [tab, setTab] = useState<'dashboard' | 'incidents' | 'providers'>('dashboard')
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [updates, setUpdates] = useState<any[]>([])
  const [newUpdate, setNewUpdate] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [filter, setFilter] = useState({ status: '', search: '' })
  const [loading, setLoading] = useState(true)

  // Provider form
  const [showProvForm, setShowProvForm] = useState(false)
  const [provForm, setProvForm] = useState({ name: '', phone: '', email: '', category: 'general', notes: '' })

  useEffect(() => {
    if (authenticated) loadData()
  }, [authenticated])

  async function loadData() {
    const [incRes, provRes] = await Promise.all([
      supabase.from('incidents').select('*, provider:providers(*)').order('created_at', { ascending: false }),
      supabase.from('providers').select('*').order('name')
    ])
    setIncidents(incRes.data || [])
    setProviders(provRes.data || [])
    setLoading(false)
  }

  function handlePin(e: React.FormEvent) {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      setAuthenticated(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  async function loadIncidentDetail(incident: Incident) {
    setSelectedIncident(incident)
    setNewStatus(incident.status)
    const { data } = await supabase.from('incident_updates').select('*')
      .eq('incident_id', incident.id).order('created_at', { ascending: true })
    setUpdates(data || [])
  }

  async function addUpdate() {
    if (!newUpdate.trim() || !selectedIncident) return
    const updateData: any = { incident_id: selectedIncident.id, message: newUpdate, created_by: 'Admin' }
    if (newStatus !== selectedIncident.status) {
      updateData.status_change = newStatus
      await supabase.from('incidents').update({
        status: newStatus, updated_at: new Date().toISOString(),
        resolved_at: newStatus === 'resuelto' ? new Date().toISOString() : null
      }).eq('id', selectedIncident.id)
    }
    await supabase.from('incident_updates').insert([updateData])
    setNewUpdate('')
    loadData()
    loadIncidentDetail({ ...selectedIncident, status: newStatus })
  }

  async function assignProvider(incidentId: string, providerId: string) {
    await supabase.from('incidents').update({ provider_id: providerId, status: 'asignado', updated_at: new Date().toISOString() }).eq('id', incidentId)
    const prov = providers.find(p => p.id === providerId)
    await supabase.from('incident_updates').insert([{ incident_id: incidentId, message: `Asignado a ${prov?.name}`, status_change: 'asignado', created_by: 'Admin' }])
    loadData()
  }

  async function addProvider(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('providers').insert([provForm])
    setProvForm({ name: '', phone: '', email: '', category: 'general', notes: '' })
    setShowProvForm(false)
    loadData()
  }

  async function deleteProvider(id: string) {
    if (!confirm('¿Eliminar proveedor?')) return
    await supabase.from('providers').delete().eq('id', id)
    loadData()
  }

  // PIN Screen
  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="card max-w-sm w-full space-y-6">
          <div className="text-center">
            <Lock className="mx-auto text-castle-gold mb-4" size={48} />
            <h1 className="text-2xl font-semibold">{t.admin[lang]}</h1>
          </div>
          <form onSubmit={handlePin} className="space-y-4">
            <input type="password" inputMode="numeric" maxLength={4} placeholder={t.enterPin[lang]}
              className={`w-full border-2 rounded-xl px-4 py-3 text-center text-2xl tracking-widest ${pinError ? 'border-red-500' : ''}`}
              value={pin} onChange={e => { setPin(e.target.value); setPinError(false) }} />
            {pinError && <p className="text-red-500 text-center text-sm">{t.wrongPin[lang]}</p>}
            <button type="submit" className="w-full btn-primary">{t.enter[lang]}</button>
          </form>
          <Link href={`/?lang=${lang}`} className="block text-center text-gray-400 hover:text-gray-600">{t.back[lang]}</Link>
        </div>
      </div>
    )
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  const stats = {
    nuevo: incidents.filter(i => i.status === 'nuevo').length,
    progreso: incidents.filter(i => ['asignado', 'en_progreso'].includes(i.status)).length,
    resuelto: incidents.filter(i => i.status === 'resuelto').length,
  }

  const filtered = incidents.filter(i => {
    if (filter.status && i.status !== filter.status) return false
    if (filter.search && !i.property_name.toLowerCase().includes(filter.search.toLowerCase()) && !i.description.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  // Incident Detail Modal
  if (selectedIncident) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setSelectedIncident(null)} className="flex items-center gap-2 text-gray-500 hover:text-castle-dark mb-6">
          ← {t.back[lang]}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-semibold">{selectedIncident.property_name}</h1>
                  <p className="text-gray-500">{selectedIncident.category} • {new Date(selectedIncident.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm status-${selectedIncident.status}`}>{selectedIncident.status}</span>
                  <span className={`px-2 py-1 rounded text-sm urgency-${selectedIncident.urgency}`}>{selectedIncident.urgency}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{selectedIncident.description}</p>
              <div className="border-t pt-3 text-sm text-gray-600 flex gap-4">
                <span>👤 {selectedIncident.reporter_type}: {selectedIncident.reporter_name || '—'}</span>
                {selectedIncident.reporter_contact && <span>📞 {selectedIncident.reporter_contact}</span>}
              </div>
            </div>
            {/* Timeline */}
            <div className="card">
              <h2 className="font-semibold mb-4">Timeline</h2>
              <div className="space-y-3 mb-6">
                {updates.map((u: any) => (
                  <div key={u.id} className="flex gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 ${u.status_change ? 'bg-castle-gold' : 'bg-gray-300'}`} />
                    <div>
                      <p className="text-gray-700">{u.message}</p>
                      {u.status_change && <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs status-${u.status_change}`}>→ {u.status_change}</span>}
                      <p className="text-xs text-gray-400">{u.created_by} • {new Date(u.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="flex gap-2">
                  <select className="border rounded-lg px-3 py-2 text-sm" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="nuevo">nuevo</option><option value="asignado">asignado</option>
                    <option value="en_progreso">en_progreso</option><option value="resuelto">resuelto</option>
                  </select>
                  {newStatus !== selectedIncident.status && <span className="text-castle-gold text-sm self-center">↑ cambio de estado</span>}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Agregar nota..." className="flex-1 border rounded-lg px-4 py-2"
                    value={newUpdate} onChange={e => setNewUpdate(e.target.value)} onKeyDown={e => e.key === 'Enter' && addUpdate()} />
                  <button onClick={addUpdate} className="btn-primary px-4"><Send size={18} /></button>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="font-semibold mb-3">{t.providers[lang]}</h2>
              {selectedIncident.provider ? (
                <div>
                  <p className="font-medium">{(selectedIncident.provider as Provider).name}</p>
                  <p className="text-sm text-gray-500">{(selectedIncident.provider as Provider).phone}</p>
                </div>
              ) : (
                <select className="w-full border rounded-lg px-3 py-2"
                  onChange={e => e.target.value && assignProvider(selectedIncident.id, e.target.value)}>
                  <option value="">Asignar proveedor...</option>
                  {providers.filter(p => p.active).map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Admin Nav */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['dashboard', 'incidents', 'providers'] as const).map(t2 => (
            <button key={t2} onClick={() => setTab(t2)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${tab === t2 ? 'bg-castle-gold text-white' : 'bg-white hover:bg-gray-100'}`}>
              {t2 === 'dashboard' ? t.dashboard[lang] : t2 === 'incidents' ? t.incidents[lang] : t.providers[lang]}
            </button>
          ))}
        </div>
        <Link href={`/?lang=${lang}`} className="text-gray-400 hover:text-gray-600 text-sm">{t.back[lang]}</Link>
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="card"><div className="flex items-center gap-3"><div className="p-3 bg-blue-100 rounded-lg"><AlertTriangle className="text-blue-600" size={24} /></div><div><p className="text-2xl font-bold">{stats.nuevo}</p><p className="text-gray-500 text-sm">{t.new[lang]}</p></div></div></div>
            <div className="card"><div className="flex items-center gap-3"><div className="p-3 bg-orange-100 rounded-lg"><Clock className="text-orange-600" size={24} /></div><div><p className="text-2xl font-bold">{stats.progreso}</p><p className="text-gray-500 text-sm">{t.inProgress[lang]}</p></div></div></div>
            <div className="card"><div className="flex items-center gap-3"><div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={24} /></div><div><p className="text-2xl font-bold">{stats.resuelto}</p><p className="text-gray-500 text-sm">{t.resolved[lang]}</p></div></div></div>
          </div>
          <div className="card">
            <h2 className="font-semibold mb-4">{lang === 'es' ? 'Incidencias recientes' : 'Recent incidents'}</h2>
            {incidents.slice(0, 5).map(i => (
              <button key={i.id} onClick={() => loadIncidentDetail(i)} className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 mb-2 text-left">
                <div><p className="font-medium">{i.property_name}</p><p className="text-sm text-gray-500">{i.category} • {i.description.slice(0, 40)}...</p></div>
                <span className={`px-3 py-1 rounded-full text-xs status-${i.status}`}>{i.status}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Incidents Tab */}
      {tab === 'incidents' && (
        <>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder={t.search[lang] + '...'} className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={filter.search} onChange={e => setFilter({...filter, search: e.target.value})} />
            </div>
            <select className="border rounded-lg px-4 py-2" value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})}>
              <option value="">Todos</option><option value="nuevo">Nuevo</option><option value="asignado">Asignado</option>
              <option value="en_progreso">En progreso</option><option value="resuelto">Resuelto</option>
            </select>
          </div>
          {filtered.map(i => (
            <button key={i.id} onClick={() => loadIncidentDetail(i)} className="card w-full text-left hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div><h3 className="font-semibold">{i.property_name}</h3><p className="text-gray-600 text-sm">{i.description}</p>
                  <p className="text-xs text-gray-400 mt-1">👤 {i.reporter_type}: {i.reporter_name || '—'} • 📅 {new Date(i.created_at).toLocaleDateString()}</p></div>
                <div className="flex gap-2"><span className={`px-3 py-1 rounded-full text-xs status-${i.status}`}>{i.status}</span><span className={`px-2 py-1 rounded text-xs urgency-${i.urgency}`}>{i.urgency}</span></div>
              </div>
            </button>
          ))}
        </>
      )}

      {/* Providers Tab */}
      {tab === 'providers' && (
        <>
          <button onClick={() => setShowProvForm(true)} className="btn-primary flex items-center gap-2"><Plus size={20} />{lang === 'es' ? 'Agregar proveedor' : 'Add provider'}</button>
          {showProvForm && (
            <form onSubmit={addProvider} className="card space-y-4">
              <input required type="text" placeholder={lang === 'es' ? 'Nombre' : 'Name'} className="w-full border rounded-lg px-4 py-2"
                value={provForm.name} onChange={e => setProvForm({...provForm, name: e.target.value})} />
              <select className="w-full border rounded-lg px-4 py-2" value={provForm.category} onChange={e => setProvForm({...provForm, category: e.target.value})}>
                <option value="plomeria">🔧 Plomería</option><option value="electricidad">⚡ Electricidad</option>
                <option value="limpieza">🧹 Limpieza</option><option value="ac">❄️ AC</option><option value="general">📦 General</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="tel" placeholder={t.phone[lang]} className="w-full border rounded-lg px-4 py-2"
                  value={provForm.phone} onChange={e => setProvForm({...provForm, phone: e.target.value})} />
                <input type="email" placeholder={t.email[lang]} className="w-full border rounded-lg px-4 py-2"
                  value={provForm.email} onChange={e => setProvForm({...provForm, email: e.target.value})} />
              </div>
              <div className="flex gap-2"><button type="submit" className="btn-primary">Guardar</button><button type="button" onClick={() => setShowProvForm(false)} className="btn-secondary">Cancelar</button></div>
            </form>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map(p => (
              <div key={p.id} className={`card ${!p.active ? 'opacity-50' : ''}`}>
                <div className="flex justify-between"><div><h3 className="font-semibold">{p.name}</h3><p className="text-sm text-gray-500">{p.category}</p></div>
                  <button onClick={() => deleteProvider(p.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button></div>
                {p.phone && <p className="text-sm text-gray-600">📞 {p.phone}</p>}
                {p.email && <p className="text-sm text-gray-600">✉️ {p.email}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminPage() {
  return <Suspense fallback={<div className="text-center py-20">Loading...</div>}><AdminContent /></Suspense>
}
