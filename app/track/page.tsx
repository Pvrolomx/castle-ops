'use client'
export const dynamic = 'force-dynamic'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Incident } from '@/lib/supabase'
import { t, Lang } from '@/lib/i18n'
import { ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'

function TrackForm() {
  const searchParams = useSearchParams()
  const [lang] = useState<Lang>((searchParams.get('lang') as Lang) || 'es')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Incident[]>([])
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await supabase.from('incidents')
      .select('*')
      .or(`reporter_contact.ilike.%${query}%,reporter_name.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    setResults(data || [])
    setSearched(true)
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
        <p className="text-gray-500 text-center">{t.enterEmail[lang]}</p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input type="text" placeholder={lang === 'es' ? 'Email, teléfono o nombre...' : 'Email, phone or name...'}
            className="flex-1 border-2 rounded-xl px-4 py-3"
            value={query} onChange={e => setQuery(e.target.value)} />
          <button type="submit" className="btn-primary px-6">
            <Search size={20} />
          </button>
        </form>

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
