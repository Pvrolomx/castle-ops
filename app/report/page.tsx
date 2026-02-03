'use client'
export const dynamic = 'force-dynamic'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { OWNERS, RENTAL_PROPERTIES, CATEGORIES, URGENCY } from '@/lib/config'
import { t, Lang } from '@/lib/i18n'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function ReportForm() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<Lang>((searchParams.get('lang') as Lang) || 'es')
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [reporterType, setReporterType] = useState<'renter' | 'owner' | ''>('')
  
  // Owner code flow
  const [ownerCode, setOwnerCode] = useState('')
  const [ownerError, setOwnerError] = useState(false)
  const [matchedOwner, setMatchedOwner] = useState<typeof OWNERS[0] | null>(null)
  
  const [selectedProperty, setSelectedProperty] = useState('')
  const [form, setForm] = useState({
    category: 'plomeria',
    description: '',
    urgency: 'normal',
    reporter_name: '',
    reporter_contact: '',
    reporter_email: ''
  })

  function validateOwnerCode() {
    const owner = OWNERS.find(o => o.code === ownerCode)
    if (owner) {
      setMatchedOwner(owner)
      setOwnerError(false)
      if (owner.properties.length === 1) {
        setSelectedProperty(owner.properties[0])
      }
    } else {
      setOwnerError(true)
      setMatchedOwner(null)
    }
  }

  function proceedFromOwner() {
    if (matchedOwner && selectedProperty) {
      setStep(3)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('incidents').insert([{
      property_name: selectedProperty,
      reporter_type: reporterType === 'renter' ? 'huesped' : 'propietario',
      reporter_name: reporterType === 'owner' ? matchedOwner?.name : form.reporter_name,
      reporter_contact: reporterType === 'owner' ? (matchedOwner?.name || '') : (form.reporter_contact || form.reporter_email),
      category: form.category,
      description: form.description,
      urgency: form.urgency
    }])

    if (error) {
      alert('Error: ' + error.message)
      setLoading(false)
      return
    }

    // Send email notification
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: selectedProperty,
          category: form.category,
          description: form.description,
          urgency: form.urgency,
          reporterType: reporterType === 'owner' ? 'propietario' : 'huesped',
          reporterName: reporterType === 'owner' ? matchedOwner?.name : form.reporter_name,
          reporterContact: form.reporter_contact || form.reporter_email
        })
      })
    } catch (e) { /* email notification is best-effort */ }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        <h1 className="text-3xl font-semibold text-castle-dark">{t.reportSent[lang]}</h1>
        <p className="text-gray-500 text-lg whitespace-pre-line">{t.reportSentMsg[lang]}</p>
        <div className="flex gap-4 mt-4">
          <Link href={`/?lang=${lang}`} className="btn-primary">{t.back[lang]}</Link>
          <button onClick={() => { setSubmitted(false); setStep(1); setReporterType(''); setMatchedOwner(null); setOwnerCode(''); setSelectedProperty('') }} 
            className="btn-secondary">{t.newReport[lang]}</button>
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

      {/* Step 1: Who are you? */}
      {step === 1 && (
        <div className="card space-y-6">
          <h1 className="text-2xl font-semibold text-castle-dark text-center">{t.whoAreYou[lang]}</h1>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => { setReporterType('owner'); setStep(2) }}
              className="p-8 border-2 rounded-xl hover:border-castle-gold hover:bg-amber-50 transition-all text-center">
              <span className="text-4xl block mb-3">🏠</span>
              <span className="font-semibold text-lg">{t.owner[lang]}</span>
            </button>
            <button onClick={() => { setReporterType('renter'); setStep(2) }}
              className="p-8 border-2 rounded-xl hover:border-castle-gold hover:bg-amber-50 transition-all text-center">
              <span className="text-4xl block mb-3">🧳</span>
              <span className="font-semibold text-lg">{t.renter[lang]}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Property selection */}
      {step === 2 && reporterType === 'owner' && (
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
                {lang === 'es' ? 'Bienvenido' : 'Welcome'}, {matchedOwner.name} 👋
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

          <button onClick={() => { setStep(1); setReporterType(''); setOwnerCode(''); setMatchedOwner(null) }}
            className="w-full text-gray-400 hover:text-gray-600 py-2">{t.back[lang]}</button>
        </div>
      )}

      {step === 2 && reporterType === 'renter' && (
        <div className="card space-y-6">
          <h1 className="text-2xl font-semibold text-castle-dark text-center">{t.selectProperty[lang]}</h1>
          <div className="space-y-2">
            {RENTAL_PROPERTIES.map(p => (
              <button key={p} onClick={() => { setSelectedProperty(p); setStep(3) }}
                className="w-full text-left p-4 rounded-xl border-2 hover:border-castle-gold hover:bg-amber-50 transition-all text-lg">
                🏡 {p}
              </button>
            ))}
          </div>
          <button onClick={() => { setStep(1); setReporterType('') }}
            className="w-full text-gray-400 hover:text-gray-600 py-2">{t.back[lang]}</button>
        </div>
      )}

      {/* Step 3: Issue details */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">{t.property[lang]}</p>
            <p className="font-semibold text-lg">{selectedProperty}</p>
            {matchedOwner && <p className="text-sm text-gray-400">{matchedOwner.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.category[lang]}</label>
            <select className="w-full border-2 rounded-xl px-4 py-3"
              value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label[lang]}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.description[lang]}</label>
            <textarea required rows={4} className="w-full border-2 rounded-xl px-4 py-3"
              placeholder={lang === 'es' ? 'Describe el problema con detalle...' : 'Describe the issue in detail...'}
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.urgency[lang]}</label>
            <div className="grid grid-cols-2 gap-2">
              {URGENCY.map(u => (
                <button key={u.value} type="button" onClick={() => setForm({...form, urgency: u.value})}
                  className={`p-3 rounded-xl border-2 transition-all ${form.urgency === u.value ? 'border-castle-gold bg-amber-50' : 'hover:border-gray-300'}`}>
                  {u.label[lang]}
                </button>
              ))}
            </div>
          </div>

          {reporterType === 'renter' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-castle-dark">{t.contactInfo[lang]}</h3>
              <input type="text" placeholder={t.yourName[lang]}
                className="w-full border-2 rounded-xl px-4 py-3"
                value={form.reporter_name} onChange={e => setForm({...form, reporter_name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="tel" placeholder={t.phone[lang]}
                  className="w-full border-2 rounded-xl px-4 py-3"
                  value={form.reporter_contact} onChange={e => setForm({...form, reporter_contact: e.target.value})} />
                <input type="email" placeholder={t.email[lang]}
                  className="w-full border-2 rounded-xl px-4 py-3"
                  value={form.reporter_email} onChange={e => setForm({...form, reporter_email: e.target.value})} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary text-lg py-4 disabled:opacity-50">
            {loading ? t.sending[lang] : t.send[lang]}
          </button>

          <button type="button" onClick={() => setStep(2)}
            className="w-full text-gray-400 hover:text-gray-600 py-2">{t.back[lang]}</button>
        </form>
      )}
    </div>
  )
}

export default function ReportPage() {
  return <Suspense fallback={<div className="text-center py-20">Loading...</div>}><ReportForm /></Suspense>
}

