'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { OWNERS, RENTAL_PROPERTIES, ALL_PROPERTIES, CATEGORIES, URGENCY } from '@/lib/config'
import { t, Lang } from '@/lib/i18n'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function ReportForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [lang, setLang] = useState<Lang>((searchParams.get('lang') as Lang) || 'es')
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [reporterType, setReporterType] = useState<'renter' | 'owner' | ''>('')
  const [selectedOwner, setSelectedOwner] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('')
  const [form, setForm] = useState({
    category: 'plomeria',
    description: '',
    urgency: 'normal',
    reporter_name: '',
    reporter_contact: '',
    reporter_email: ''
  })

  const ownerProperties = OWNERS.find(o => o.name === selectedOwner)?.properties || []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('incidents').insert([{
      property_name: selectedProperty,
      reporter_type: reporterType === 'renter' ? 'huesped' : 'propietario',
      reporter_name: reporterType === 'owner' ? selectedOwner : form.reporter_name,
      reporter_contact: form.reporter_contact || form.reporter_email,
      category: form.category,
      description: form.description,
      urgency: form.urgency
    }])

    if (error) {
      alert('Error: ' + error.message)
      setLoading(false)
      return
    }

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
        <p className="text-gray-500 text-lg">{t.reportSentMsg[lang]}</p>
        <div className="flex gap-4 mt-4">
          <Link href={`/?lang=${lang}`} className="btn-primary">{t.back[lang]}</Link>
          <button onClick={() => { setSubmitted(false); setStep(1); setReporterType(''); setSelectedOwner(''); setSelectedProperty('') }} 
            className="btn-secondary">{t.newReport[lang]}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Lang Toggle */}
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

      {/* Step 2: Select property */}
      {step === 2 && (
        <div className="card space-y-6">
          <h1 className="text-2xl font-semibold text-castle-dark text-center">
            {reporterType === 'owner' ? t.selectOwner[lang] : t.selectProperty[lang]}
          </h1>

          {reporterType === 'owner' ? (
            <>
              <select className="w-full border-2 rounded-xl px-4 py-3 text-lg"
                value={selectedOwner} onChange={e => { setSelectedOwner(e.target.value); setSelectedProperty('') }}>
                <option value="">{t.selectOwner[lang]}...</option>
                {OWNERS.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
              </select>
              {selectedOwner && ownerProperties.length === 1 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">{t.property[lang]}:</p>
                  <p className="font-semibold text-lg">{ownerProperties[0]}</p>
                </div>
              )}
              {selectedOwner && ownerProperties.length > 1 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{t.selectProperty[lang]}:</p>
                  {ownerProperties.map(p => (
                    <button key={p} onClick={() => setSelectedProperty(p)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedProperty === p ? 'border-castle-gold bg-amber-50' : 'hover:border-gray-300'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
              {selectedOwner && (
                <button onClick={() => {
                  if (ownerProperties.length === 1) setSelectedProperty(ownerProperties[0])
                  if (selectedProperty || ownerProperties.length === 1) setStep(3)
                }}
                  disabled={!selectedProperty && ownerProperties.length > 1}
                  className="w-full btn-primary disabled:opacity-50">
                  {lang === 'es' ? 'Continuar' : 'Continue'}
                </button>
              )}
            </>
          ) : (
            <div className="space-y-2">
              {RENTAL_PROPERTIES.map(p => (
                <button key={p} onClick={() => { setSelectedProperty(p); setStep(3) }}
                  className="w-full text-left p-4 rounded-xl border-2 hover:border-castle-gold hover:bg-amber-50 transition-all text-lg">
                  🏡 {p}
                </button>
              ))}
            </div>
          )}

          <button onClick={() => { setStep(1); setReporterType(''); setSelectedOwner('') }}
            className="w-full text-gray-400 hover:text-gray-600 py-2">{t.back[lang]}</button>
        </div>
      )}

      {/* Step 3: Issue details + contact */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">{t.property[lang]}</p>
            <p className="font-semibold text-lg">{selectedProperty}</p>
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

          {/* Contact Info - only for renters */}
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
