'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase, Incident, Provider } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Filter, Search } from 'lucide-react'

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [filter, setFilter] = useState({ status: '', category: '', search: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [incRes, provRes] = await Promise.all([
      supabase.from('incidents').select('*, provider:providers(*)').order('created_at', { ascending: false }),
      supabase.from('providers').select('*').eq('active', true)
    ])
    setIncidents(incRes.data || [])
    setProviders(provRes.data || [])
    setLoading(false)
  }

  const filtered = incidents.filter(i => {
    if (filter.status && i.status !== filter.status) return false
    if (filter.category && i.category !== filter.category) return false
    if (filter.search && !i.property_name.toLowerCase().includes(filter.search.toLowerCase()) 
        && !i.description.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const categories = ['plomeria', 'electricidad', 'limpieza', 'ac', 'otro']
  const statuses = ['nuevo', 'asignado', 'en_progreso', 'resuelto']

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-castle-dark">Incidents</h1>
        <Link href="/incidents/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Incident
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={filter.search} onChange={e => setFilter({...filter, search: e.target.value})} />
            </div>
          </div>
          <select className="border rounded-lg px-4 py-2" value={filter.status} 
            onChange={e => setFilter({...filter, status: e.target.value})}>
            <option value="">All Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="border rounded-lg px-4 py-2" value={filter.category}
            onChange={e => setFilter({...filter, category: e.target.value})}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">
            No incidents found. {filter.search || filter.status || filter.category ? 'Try different filters.' : 'Create your first one!'}
          </div>
        ) : filtered.map(incident => (
          <Link key={incident.id} href={`/incidents/${incident.id}`} className="card block hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-castle-dark">{incident.property_name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium status-${incident.status}`}>
                    {incident.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs urgency-${incident.urgency}`}>
                    {incident.urgency}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{incident.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>📁 {incident.category}</span>
                  <span>👤 {incident.reporter_type}: {incident.reporter_name || 'Unknown'}</span>
                  {incident.provider && <span>🔧 {(incident.provider as Provider).name}</span>}
                  <span>📅 {new Date(incident.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
