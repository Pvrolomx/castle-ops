'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Lock, AlertTriangle, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react'

const STAFF_PIN = '1978'

// Properties that have a real guide page
const GUIDE_PROPERTIES = [
  { name: 'Nitta 102',         slug: 'nitta-102' },
  { name: 'Avida 408',         slug: 'avida-408' },
  { name: 'Mismaloya 5705',    slug: 'mismaloya-5705' },
  { name: 'Mismaloya 7202',    slug: 'mismaloya-7202' },
  { name: 'El Cielo 101',      slug: 'cielo-101' },
  { name: 'Villa Magna 253 A', slug: 'villa-magna-253a' },
]

type Screen = 'pin' | 'menu' | 'guides'

export default function StaffPage() {
  const [screen, setScreen] = useState<Screen>('pin')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function handlePin(digit: string) {
    if (pin.length >= 4) return
    const next = pin + digit
    setPin(next)
    setError(false)
    if (next.length === 4) {
      if (next === STAFF_PIN) {
        setTimeout(() => setScreen('menu'), 200)
      } else {
        setTimeout(() => { setError(true); setPin('') }, 400)
      }
    }
  }

  function handleBack() {
    if (screen === 'guides') { setScreen('menu'); return }
    setScreen('pin'); setPin(''); setError(false)
  }

  if (screen === 'pin') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={24} className="text-gray-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Acceso Staff</h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa tu PIN de 4 dígitos</p>
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-4 mb-8">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full transition-all ${
              pin.length > i
                ? error ? 'bg-red-500' : 'bg-emerald-600'
                : 'bg-gray-200'
            }`} />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
            <button key={i}
              onClick={() => d === '⌫' ? setPin(p => p.slice(0,-1)) : d ? handlePin(d) : null}
              className={`h-14 rounded-2xl text-xl font-medium transition-all ${
                d === '' ? 'invisible' :
                d === '⌫' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' :
                'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm active:scale-95'
              }`}>
              {d}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )

  if (screen === 'menu') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Castle Solutions" className="h-16 w-auto mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Bienvenido, Staff</p>
        </div>

        <div className="space-y-3">
          <Link href="/report?type=owner"
            className="flex items-center gap-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-5 rounded-2xl shadow-lg transition-all">
            <AlertTriangle size={24} />
            <div className="flex-1">
              <p className="font-semibold">Reportar Incidencia</p>
              <p className="text-emerald-100 text-xs">Registrar un problema en una propiedad</p>
            </div>
            <ChevronRight size={20} className="text-emerald-200" />
          </Link>

          <button onClick={() => setScreen('guides')}
            className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-2xl shadow-lg transition-all">
            <BookOpen size={24} />
            <div className="flex-1 text-left">
              <p className="font-semibold">Ver Guías de Propiedades</p>
              <p className="text-blue-100 text-xs">Revisar información de cada unidad</p>
            </div>
            <ChevronRight size={20} className="text-blue-200" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )

  // guides screen
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-sm mx-auto">
        <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={18} /> Volver
        </button>

        <h1 className="text-xl font-semibold text-gray-800 mb-1">Guías de Propiedades</h1>
        <p className="text-gray-500 text-sm mb-6">Selecciona una propiedad para ver su información</p>

        <div className="space-y-2">
          {GUIDE_PROPERTIES.map(p => (
            <Link key={p.slug} href={`/guide/${p.slug}?staff=1`}
              className="flex items-center gap-4 bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 px-5 py-4 rounded-xl transition-all shadow-sm">
              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-lg">🏠</div>
              <span className="flex-1 font-medium text-gray-800">{p.name}</span>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Solo se muestran propiedades con guía activa
        </p>
      </div>
    </div>
  )
}
