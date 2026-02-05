'use client'
export const dynamic = 'force-dynamic'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { OWNERS, REQUEST_CATEGORIES } from '@/lib/config'
import { t, Lang } from '@/lib/i18n'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function RequestForm() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<Lang>((searchParams.get('lang') as Lang) || 'es')

  const [step, setStep] = useState(2)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [ownerCode, setOwnerCode] = useState('')
  const [ownerError, setOwnerError] = useState(false)
  const [matchedOwner, setMatchedOwner] = useState<typeof OWNERS[0] | null>(null)
  const [selectedProperty, setSelectedProperty] = useState('')
  const [form, setForm] = useState({
    category: 'limpieza',
    description: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('incidents').insert([{
      property_name: selectedProperty,
      reporter_type: 'propietario',
      reporter_name: matchedOwner?.name || '',
      reporter_contact: matchedOwner?.name || '',
      category: `solicitud:${form.category}`,
      description: form.description,
      urgency: 'normal'
    }])

    if (error) {
      alert('Error: ' + error.message)
      setLoading(false)
      return
    }

    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: selectedProperty,
          category: `Solicitud: ${form.category}`,
          description: form.description,
          urgency: 'normal',
          reporterType: 'propietario',
          reporterName: matchedOwner?.name || '',
          reporterContact: ''
        })
      })
    } catch (e) { /* best-effort */ }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <CheckCircle className="text-blue-600" size={48} />
        </div>
        <h1 className="text-3xl font-semibold text-castle-dark">{t.requestSent[lang]}</h1>
        <p className="text-gray-500 text-lg whitespace-pre-line">{t.requestSentMsg[lang]}</p>
        <div className="flex gap-4 mt-4">
          <Link href={`/?lang=${lang}`} className="btn-primary">{t.back[lang]}</Link>
          <button onClick={() => { setSubmitted(false); setStep(2); setOwnerCode(''); setMatchedOwner(null); setSelectedProperty('') }}
            className="btn-secondary">{lang === 'es' ? 'Nueva Solicitud' : 'New Request'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="fixed top-4 right-4 z-50">
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="bg-white shadow-md rounded-full px-4 py-2 text-sm font-medium hover:shadow-lg transition-shadow">
          {lang === 'es' ? '🇺🇸 EN' : '🇲🇽 ES'}
        </button>
      </div>

      <Link href={`/?lang=${lang}`} className="flex items-center gap-2 text-gray-500 hover:text-castle-dark mb-6">
        <ArrowLeft size={20} /> {t.back[lang]}
      </Link>

      {/* Step 2: Owner code */}
      {step === 2 && (
        <div className="card space-y-6">
          <h1 className="text-2xl font-semibold text-castle-dark text-center">
            {lang === 'es' ? 'Ingresa tu código' : 'Enter your code'}
          </h1>
          <p className="text-gray-500 text-center text-sm">
            {lang === 'es' ? 'Código de 4 dígitos asignado por Castle Solutions' : '4-digit code assigned by Castle Solutions'}
          </p>

          <div className="flex justify-center">
            <input type="text" inputMode="numeric" maxLength={4}
              className={`border-2 rounded-xl px-6 py-4 text-center text-3xl tracking-[0.5em] w-48 ${ownerError ? 'border-red-500 shake' : matchedOwner ? 'border-green-500' : ''}`}
              placeholder="••••"
              value={ownerCode}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                setOwnerCode(val)
                setOwnerError(false)
                setMatchedOwner(null)
                setSelectedProperty('')
                if (val.length === 4) {
                  const owner = OWNERS.find(o => o.code === val)
                  if (owner) {
                    setMatchedOwner(owner)
                    if (owner.properties.length === 1) setSelectedProperty(owner.properties[0])
                  } else {
                    setOwnerError(true)
                  }
                }
              }} />
          </div>

          {ownerError && (
            <p className="text-red-500 text-center text-sm">
              {lang === 'es' ? 'Código no encontrado' : 'Code not found'}
            </p>
          )}

          {matchedOwner && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-3">
              <p className="text-green-800 font-medium text-lg">
                {matchedOwner.greeting?.[lang] || (lang === 'es' ? 'Bienvenido' : 'Welcome')}, {matchedOwner.name} 👋
              </p>

              {matchedOwner.properties.length === 1 ? (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-500">{t.property[lang]}</p>
                  <p className="font-semibold">{matchedOwner.properties[0]}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{t.selectProperty[lang]}:</p>
                  {matchedOwner.properties.map(p => (
                    <button key={p} onClick={() => setSelectedProperty(p)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedProperty === p ? 'border-castle-gold bg-amber-50' : 'bg-white hover:border-gray-300'}`}>
                      🏡 {p}
                    </button>
                  ))}
                </div>
              )}

              <button onClick={() => setStep(3)}
                disabled={!selectedProperty}
                className="w-full btn-primary disabled:opacity-50 mt-2">
                {lang === 'es' ? 'Continuar' : 'Continue'}
              </button>
            </div>
          )}

          <Link href={`/?lang=${lang}`}
            className="block w-full text-center text-gray-400 hover:text-gray-600 py-2">{t.back[lang]}</Link>
        </div>
      )}

      {/* Step 3: Request details */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">{t.property[lang]}</p>
            <p className="font-semibold text-lg">{selectedProperty}</p>
            {matchedOwner && <p className="text-sm text-gray-400">{matchedOwner.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.requestCategory[lang]}</label>
            <select className="w-full border-2 rounded-xl px-4 py-3"
              value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {REQUEST_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label[lang]}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.requestDescription[lang]}</label>
            <textarea required rows={4} className="w-full border-2 rounded-xl px-4 py-3"
              placeholder={lang === 'es' ? 'Describe lo que necesitas...' : 'Describe what you need...'}
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary text-lg py-4 disabled:opacity-50">
            {loading ? t.sending[lang] : t.sendRequest[lang]}
          </button>

          <button type="button" onClick={() => setStep(2)}
            className="w-full text-gray-400 hover:text-gray-600 py-2">{t.back[lang]}</button>
        </form>
      )}
    </div>
  )
}

export default function RequestPage() {
  return <Suspense fallback={<div className="text-center py-20">Loading...</div>}><RequestForm /></Suspense>
}
