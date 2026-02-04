'use client'
export const dynamic = 'force-dynamic'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Incident } from '@/lib/supabase'
import { OWNERS } from '@/lib/config'
import { t, Lang } from '@/lib/i18n'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function TrackForm() {
  const searchParams = useSearchParams()
  const [lang] = useState<Lang>((searchParams.get('lang') as Lang) || 'es')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [matchedOwner, setMatchedOwner] = useState<typeof OWNERS[0] | null>(null)
  const [results, setResults] = useState<Incident[]>([])
  const [searched, setSearched] = useState(false)

  async function handleCodeEntry(val: string) {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    setCode(clean)
    setCodeError(false)
    setMatchedOwner(null)
    setSearched(false)
    setResults([])

    if (clean.length === 4) {
      const owner = OWNERS.find(o => o.code === clean)
      if (owner) {
        setMatchedOwner(owner)
        // Search incidents for all owner properties
        const { data } = await supabase.from('incidents')
          .select('*')
          .in('property_name', owner.properties)
          .order('created_at', { ascending: false })
        setResults(data || [])
        setSearched(true)
      } else {
        setCodeError(true)
      }
    }
  }

  const statusLabel: Record<string, Record<Lang, string>> = {
    nuevo: { es: '📋 Recibido', en: '📋 Received' },
    asignado: { es: '🔄 En progreso', en: '🔄 In progress' },
    en_progreso: { es: '🔄 En progreso', en: '🔄 In progress' },
    resuelto: { es: '✅ Resuelto', en: '✅ Resolved' }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link href={`/?lang=${lang}`} className="flex items-center gap-2 text-gray-500 hover:text-castle-dark mb-6">
        <ArrowLeft size={20} /> {t.back[lang]}
      </Link>

      <div className="card space-y-6">
        <h1 className="text-2xl font-semibold text-castle-dark text-center">{t.myReports[lang]}</h1>
        <p className="text-gray-500 text-center text-sm">
          {lang === 'es' ? 'Ingresa tu código de 4 dígitos' : 'Enter your 4-digit code'}
        </p>

        <div className="flex justify-center">
          <input type="text" inputMode="numeric" maxLength={4}
            className={`border-2 rounded-xl px-6 py-4 text-center text-3xl tracking-[0.5em] w-48 ${codeError ? 'border-red-500 shake' : matchedOwner ? 'border-green-500' : ''}`}
            placeholder="••••"
            value={code}
            onChange={e => handleCodeEntry(e.target.value)} />
        </div>

        {codeError && (
          <p className="text-red-500 text-center text-sm">
            {lang === 'es' ? 'Código no encontrado' : 'Code not found'}
          </p>
        )}

        {matchedOwner && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-green-800 font-medium">
              {lang === 'es' ? 'Bienvenido' : 'Welcome'}, {matchedOwner.name} 👋
            </p>
          </div>
        )}

        {searched && results.length === 0 && (
          <p className="text-center text-gray-500">{t.noIncidents[lang]}</p>
        )}

        {results.map(incident => (
          <div key={incident.id} className="border rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{incident.property_name}</p>
                <p className="text-sm text-gray-500">{incident.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium status-${incident.status}`}>
                {statusLabel[incident.status]?.[lang] || incident.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{incident.description}</p>
            <p className="text-xs text-gray-400">{new Date(incident.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TrackPage() {
  return <Suspense fallback={<div className="text-center py-20">Loading...</div>}><TrackForm /></Suspense>
}
