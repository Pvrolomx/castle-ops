'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const FLIGHT_API = 'https://castle-flights.vercel.app/api/flight'
const ARRIVALS_API = 'https://castle-flights.vercel.app/api/arrivals'

const PROPERTIES = [
  { id: 'villa-magna-253a', name: 'Villa Magna 253 A' },
  { id: 'villa-magna-253b', name: 'Villa Magna 253 B' },
  { id: 'nitta-102', name: 'Nitta 102' },
  { id: 'mismaloya-7202', name: 'Mismaloya 7202' },
  { id: 'mismaloya-5705', name: 'Mismaloya 5705' },
  { id: 'avida-408', name: 'Avida 408' },
  { id: 'cielo-101', name: 'Cielo 101' },
]

interface FlightData {
  flight: string
  airline: string
  status: string
  progress: number
  departure: { iata: string; airport: string; scheduled: string | null; actual: string | null }
  arrival: { iata: string; airport: string; scheduled: string | null; estimated: string | null; actual: string | null; terminal: string | null; gate: string | null; delay: number }
  source: string
}

interface TrackedGuest {
  id: string
  guestName: string
  property: string
  flightNumber: string
  flightData: FlightData | null
  loading: boolean
  error: boolean
}

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
}

function timeUntil(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  const diff = d.getTime() - Date.now()
  if (diff < 0) return null
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

const STATUS_CONFIG: Record<string, { emoji: string; label: string; bg: string; text: string }> = {
  scheduled: { emoji: '🕐', label: 'Programado', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  active: { emoji: '✈️', label: 'En Vuelo', bg: 'bg-green-50', text: 'text-green-700' },
  landed: { emoji: '🛬', label: 'Aterrizó', bg: 'bg-blue-50', text: 'text-blue-700' },
  cancelled: { emoji: '❌', label: 'Cancelado', bg: 'bg-red-50', text: 'text-red-700' },
  delayed: { emoji: '⚠️', label: 'Retrasado', bg: 'bg-orange-50', text: 'text-orange-700' },
  diverted: { emoji: '↪️', label: 'Desviado', bg: 'bg-yellow-50', text: 'text-yellow-700' },
}

function GuestFlightCard({ guest, onRemove }: { guest: TrackedGuest; onRemove: (id: string) => void }) {
  const fd = guest.flightData
  const sc = fd ? STATUS_CONFIG[fd.status] || STATUS_CONFIG.scheduled : STATUS_CONFIG.scheduled
  const eta = fd ? (fd.arrival.estimated || fd.arrival.scheduled) : null
  const remaining = timeUntil(eta)

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden transition-all ${fd?.status === 'active' ? 'border-green-300 shadow-green-100' : fd?.status === 'landed' ? 'border-blue-300' : 'border-gray-200'}`}>
      <div className={`px-4 py-3 flex items-center justify-between ${sc.bg}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sc.emoji}</span>
          <div>
            <p className="font-bold text-gray-900">{guest.guestName}</p>
            <p className="text-sm text-gray-600">{guest.property}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-sm font-semibold ${sc.text}`}>{sc.label}</span>
          {remaining && fd?.status === 'active' && (
            <p className="text-lg font-bold text-green-700">{remaining}</p>
          )}
        </div>
      </div>

      {fd && (
        <div className="bg-white px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono font-bold text-lg">{fd.flight}</span>
            <span className="text-sm text-gray-500">{fd.airline}</span>
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold">{fd.departure.iata}</span>
            <div className="flex-1 mx-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${fd.progress}%`,
                  background: fd.status === 'active' ? '#059669' : fd.status === 'landed' ? '#0284c7' : '#C4A265'
                }}
              />
            </div>
            <span className="font-semibold">{fd.arrival.iata}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
            <div>
              <p className="text-gray-400">Salida</p>
              <p className="font-medium text-gray-700">{formatTime(fd.departure.actual || fd.departure.scheduled)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">ETA PVR</p>
              <p className="font-medium text-gray-700">{formatTime(eta)}</p>
            </div>
            <div className="text-right">
              {fd.arrival.delay > 0 ? (
                <>
                  <p className="text-orange-500">Retraso</p>
                  <p className="font-medium text-orange-600">+{fd.arrival.delay} min</p>
                </>
              ) : (
                <>
                  <p className="text-gray-400">Estado</p>
                  <p className="font-medium text-green-600">A tiempo</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            <a
              href={`https://castle-flights.vercel.app?flight=${fd.flight}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Ver detalle completo →
            </a>
            <button onClick={() => onRemove(guest.id)} className="text-xs text-gray-400 hover:text-red-500">
              Quitar
            </button>
          </div>
        </div>
      )}

      {guest.loading && (
        <div className="bg-white px-4 py-6 text-center text-gray-400 animate-pulse">
          Buscando vuelo {guest.flightNumber}...
        </div>
      )}

      {guest.error && (
        <div className="bg-white px-4 py-3 text-center text-sm text-orange-600">
          Vuelo {guest.flightNumber} no encontrado
          <button onClick={() => onRemove(guest.id)} className="ml-3 text-xs text-gray-400 hover:text-red-500 underline">
            Quitar
          </button>
        </div>
      )}
    </div>
  )
}

export default function FlightsPage() {
  const [guests, setGuests] = useState<TrackedGuest[]>([])
  const [newGuest, setNewGuest] = useState({ guestName: '', property: '', flightNumber: '' })
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const refreshFlights = useCallback(async () => {
    const updated = await Promise.all(
      guests.map(async (g) => {
        if (!g.flightNumber) return g
        try {
          const res = await fetch(`${FLIGHT_API}?flight=${g.flightNumber}`)
          if (res.ok) {
            const data = await res.json()
            return { ...g, flightData: data, loading: false, error: false }
          }
          return { ...g, loading: false, error: true }
        } catch {
          return { ...g, loading: false, error: true }
        }
      })
    )
    setGuests(updated)
    setLastRefresh(new Date())
  }, [guests])

  useEffect(() => {
    if (!autoRefresh || guests.length === 0) return
    const interval = setInterval(refreshFlights, 60000)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshFlights, guests.length])

  const addGuest = async () => {
    if (!newGuest.guestName || !newGuest.flightNumber) return
    const id = Date.now().toString()
    const guest: TrackedGuest = {
      id,
      guestName: newGuest.guestName,
      property: newGuest.property,
      flightNumber: newGuest.flightNumber.replace(/\s/g, '').toUpperCase(),
      flightData: null,
      loading: true,
      error: false,
    }
    setGuests(prev => [...prev, guest])
    setNewGuest({ guestName: '', property: '', flightNumber: '' })

    try {
      const res = await fetch(`${FLIGHT_API}?flight=${guest.flightNumber}`)
      if (res.ok) {
        const data = await res.json()
        setGuests(prev => prev.map(g => g.id === id ? { ...g, flightData: data, loading: false } : g))
      } else {
        setGuests(prev => prev.map(g => g.id === id ? { ...g, loading: false, error: true } : g))
      }
    } catch {
      setGuests(prev => prev.map(g => g.id === id ? { ...g, loading: false, error: true } : g))
    }
  }

  const removeGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id))
  }

  const activeFlights = guests.filter(g => g.flightData?.status === 'active')
  const scheduledFlights = guests.filter(g => g.flightData?.status === 'scheduled' || g.flightData?.status === 'delayed')
  const landedFlights = guests.filter(g => g.flightData?.status === 'landed')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:text-castle-gold">← Castle Ops</Link>
          <h1 className="text-2xl font-bold text-castle-dark mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ✈️ Vuelos de Huéspedes
          </h1>
          <p className="text-sm text-gray-500">Rastreo en tiempo real de llegadas</p>
        </div>
        <div className="text-right">
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="accent-yellow-600" />
            Auto-refresh
          </label>
          {lastRefresh && (
            <p className="text-xs text-gray-400 mt-1">
              Actualizado: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>

      {/* Summary bar */}
      {guests.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
            <p className="text-2xl font-bold text-green-700">{activeFlights.length}</p>
            <p className="text-xs text-green-600">En Vuelo</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-200">
            <p className="text-2xl font-bold text-indigo-700">{scheduledFlights.length}</p>
            <p className="text-xs text-indigo-600">Programados</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{landedFlights.length}</p>
            <p className="text-xs text-blue-600">Aterrizaron</p>
          </div>
        </div>
      )}

      {/* Add guest form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">➕ Agregar huésped para rastrear</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Nombre del huésped"
            value={newGuest.guestName}
            onChange={e => setNewGuest(p => ({ ...p, guestName: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold"
          />
          <select
            value={newGuest.property}
            onChange={e => setNewGuest(p => ({ ...p, property: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold"
          >
            <option value="">Propiedad</option>
            {PROPERTIES.map(p => (<option key={p.id} value={p.name}>{p.name}</option>))}
          </select>
          <input
            type="text"
            placeholder="Vuelo (ej. AA1234)"
            value={newGuest.flightNumber}
            onChange={e => setNewGuest(p => ({ ...p, flightNumber: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-castle-gold"
          />
          <button
            onClick={addGuest}
            disabled={!newGuest.guestName || !newGuest.flightNumber}
            className="px-4 py-2 bg-castle-gold text-white rounded-lg text-sm font-medium hover:bg-castle-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Rastrear
          </button>
        </div>
      </div>

      {/* Flight cards */}
      {guests.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">✈️</p>
          <p className="text-gray-500 mb-2">No hay vuelos rastreados</p>
          <p className="text-sm text-gray-400">Agrega un huésped con su número de vuelo arriba</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active first, then scheduled, then landed */}
          {activeFlights.map(g => <GuestFlightCard key={g.id} guest={g} onRemove={removeGuest} />)}
          {scheduledFlights.map(g => <GuestFlightCard key={g.id} guest={g} onRemove={removeGuest} />)}
          {landedFlights.map(g => <GuestFlightCard key={g.id} guest={g} onRemove={removeGuest} />)}
          {guests.filter(g => g.error || g.loading).map(g => <GuestFlightCard key={g.id} guest={g} onRemove={removeGuest} />)}
        </div>
      )}

      {/* Manual refresh */}
      {guests.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={refreshFlights}
            className="text-sm text-gray-500 hover:text-castle-gold transition-colors"
          >
            🔄 Actualizar ahora
          </button>
        </div>
      )}
    </div>
  )
}
