'use client'
import { useEffect, useState } from 'react'
import { supabase, Incident, Provider } from '@/lib/supabase'
import Link from 'next/link'
import { AlertTriangle, Users, CheckCircle, Clock, Plus } from 'lucide-react'

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [incRes, provRes] = await Promise.all([
      supabase.from('incidents').select('*').order('created_at', { ascending: false }),
      supabase.from('providers').select('*').eq('active', true)
    ])
    setIncidents(incRes.data || [])
    setProviders(provRes.data || [])
    setLoading(false)
  }

  const stats = {
    total: incidents.length,
    nuevo: incidents.filter(i => i.status === 'nuevo').length,
    en_progreso: incidents.filter(i => ['asignado', 'en_progreso'].includes(i.status)).length,
    resuelto: incidents.filter(i => i.status === 'resuelto').length,
    providers: providers.length
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-castle-dark">Dashboard</h1>
        <Link href="/incidents/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Incident
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertTriangle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-castle-dark">{stats.nuevo}</p>
              <p className="text-gray-500 text-sm">New</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-castle-dark">{stats.en_progreso}</p>
              <p className="text-gray-500 text-sm">In Progress</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-castle-dark">{stats.resuelto}</p>
              <p className="text-gray-500 text-sm">Resolved</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-castle-dark">{stats.providers}</p>
              <p className="text-gray-500 text-sm">Providers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-castle-dark">Recent Incidents</h2>
          <Link href="/incidents" className="text-castle-gold hover:underline">View all →</Link>
        </div>
        {incidents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No incidents yet. Create your first one!</p>
        ) : (
          <div className="space-y-3">
            {incidents.slice(0, 5).map(incident => (
              <Link key={incident.id} href={`/incidents/${incident.id}`} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-castle-dark">{incident.property_name}</p>
                  <p className="text-sm text-gray-500">{incident.category} • {incident.description.slice(0, 50)}...</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium status-${incident.status}`}>
                    {incident.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs urgency-${incident.urgency}`}>
                    {incident.urgency}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
