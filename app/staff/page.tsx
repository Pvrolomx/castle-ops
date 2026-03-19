'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { STAFF_MEMBERS, NOTE_CATEGORIES, RENTAL_PROPERTIES } from '@/lib/config'
import { Lang, LANG_OPTIONS } from '@/lib/i18n'

const TEXTS: Record<string, Record<Lang, string>> = {
  title: { es: 'Notas de Staff', en: 'Staff Notes', fr: 'Notes du Personnel' },
  subtitle: { es: 'Registro interno de observaciones', en: 'Internal observation log', fr: 'Journal d\'observations interne' },
  enterPin: { es: 'Ingresa tu PIN de staff', en: 'Enter your staff PIN', fr: 'Entrez votre PIN' },
  enter: { es: 'Entrar', en: 'Enter', fr: 'Entrer' },
  wrongPin: { es: 'PIN incorrecto', en: 'Wrong PIN', fr: 'PIN incorrect' },
  welcome: { es: 'Hola', en: 'Hello', fr: 'Bonjour' },
  selectProperty: { es: 'Selecciona la propiedad', en: 'Select property', fr: 'Sélectionnez la propriété' },
  category: { es: 'Tipo de nota', en: 'Note type', fr: 'Type de note' },
  note: { es: 'Nota', en: 'Note', fr: 'Note' },
  notePlaceholder: { es: 'Escribe tu observación...', en: 'Write your observation...', fr: 'Écrivez votre observation...' },
  addPhoto: { es: '📷 Agregar Foto', en: '📷 Add Photo', fr: '📷 Ajouter Photo' },
  changePhoto: { es: '📷 Cambiar Foto', en: '📷 Change Photo', fr: '📷 Changer Photo' },
  send: { es: 'Guardar Nota', en: 'Save Note', fr: 'Enregistrer' },
  sending: { es: 'Guardando...', en: 'Saving...', fr: 'Enregistrement...' },
  success: { es: '¡Nota guardada!', en: 'Note saved!', fr: 'Note enregistrée!' },
  successMsg: { es: 'Tu observación ha sido registrada.', en: 'Your observation has been recorded.', fr: 'Votre observation a été enregistrée.' },
  newNote: { es: 'Nueva Nota', en: 'New Note', fr: 'Nouvelle Note' },
  viewNotes: { es: 'Ver Notas', en: 'View Notes', fr: 'Voir Notes' },
  recentNotes: { es: 'Notas Recientes', en: 'Recent Notes', fr: 'Notes Récentes' },
  noNotes: { es: 'No hay notas aún', en: 'No notes yet', fr: 'Pas encore de notes' },
  logout: { es: 'Salir', en: 'Logout', fr: 'Déconnexion' },
  back: { es: '← Volver', en: '← Back', fr: '← Retour' },
}

export default function StaffPage() {
  const [lang, setLang] = useState<Lang>('es')
  const [pin, setPin] = useState('')
  const [staffMember, setStaffMember] = useState<typeof STAFF_MEMBERS[0] | null>(null)
  const [error, setError] = useState('')
  const [view, setView] = useState<'login' | 'form' | 'success' | 'notes'>('login')
  
  const [property, setProperty] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [recentNotes, setRecentNotes] = useState<any[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = (key: string) => TEXTS[key]?.[lang] || key

  const handleLogin = () => {
    const member = STAFF_MEMBERS.find(m => m.code === pin)
    if (member) {
      setStaffMember(member)
      setView('form')
      setError('')
      loadRecentNotes()
    } else {
      setError(t('wrongPin'))
    }
  }

  const loadRecentNotes = async () => {
    try {
      const res = await fetch('/api/staff-notes')
      if (res.ok) {
        const data = await res.json()
        setRecentNotes(data.notes || [])
      }
    } catch (e) {
      console.error('Error loading notes:', e)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!property || !category || !note.trim()) return
    
    setSending(true)
    try {
      const res = await fetch('/api/staff-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_name: staffMember?.name,
          property,
          category,
          note: note.trim(),
          photo,
        }),
      })
      
      if (res.ok) {
        setView('success')
      }
    } catch (e) {
      console.error('Error:', e)
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setProperty('')
    setCategory('')
    setNote('')
    setPhoto(null)
    setView('form')
    loadRecentNotes()
  }

  const LangToggle = () => (
    <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
      {LANG_OPTIONS.map(opt => (
        <button
          key={opt.code}
          onClick={() => setLang(opt.code)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            lang === opt.code ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  // LOGIN VIEW
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-zinc-800">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">{t('back')}</Link>
          <LangToggle />
        </header>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🏰</div>
              <h1 className="text-2xl font-semibold">{t('title')}</h1>
              <p className="text-zinc-400 text-sm">{t('subtitle')}</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('enterPin')}
                value={pin}
                onChange={e => { setPin(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:border-amber-500"
                maxLength={4}
              />
              
              {error && <p className="text-red-400 text-center text-sm">{error}</p>}
              
              <button
                onClick={handleLogin}
                disabled={pin.length < 4}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl font-medium transition-colors"
              >
                {t('enter')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // SUCCESS VIEW
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold mb-2">{t('success')}</h1>
        <p className="text-zinc-400 text-center mb-6">{t('successMsg')}</p>
        <button
          onClick={resetForm}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-medium"
        >
          {t('newNote')}
        </button>
      </div>
    )
  }

  // NOTES LIST VIEW
  if (view === 'notes') {
    return (
      <div className="min-h-screen bg-zinc-900 text-white">
        <header className="p-4 flex justify-between items-center border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <button onClick={() => setView('form')} className="text-zinc-400 hover:text-white text-sm">{t('back')}</button>
          <h1 className="font-medium">{t('recentNotes')}</h1>
          <LangToggle />
        </header>
        
        <div className="p-4 space-y-3">
          {recentNotes.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">{t('noNotes')}</p>
          ) : (
            recentNotes.map((n, i) => (
              <div key={i} className="bg-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-amber-400 font-medium">{n.property}</span>
                    <span className="text-zinc-500 text-sm ml-2">• {n.staff_name}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-zinc-400">{NOTE_CATEGORIES.find(c => c.value === n.category)?.label[lang] || n.category}</span>
                </div>
                <p className="text-zinc-300">{n.note}</p>
                {n.photo && (
                  <img src={n.photo} alt="Foto" className="w-full rounded-lg mt-2 max-h-48 object-cover" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // FORM VIEW
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="p-4 flex justify-between items-center border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
        <div>
          <span className="text-zinc-400 text-sm">{t('welcome')},</span>
          <span className="text-amber-400 font-medium ml-1">{staffMember?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <button onClick={() => { setStaffMember(null); setPin(''); setView('login') }} className="text-zinc-500 hover:text-red-400 text-sm ml-2">
            {t('logout')}
          </button>
        </div>
      </header>
      
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <h1 className="text-xl font-semibold">{t('newNote')}</h1>
        
        {/* Property */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">{t('selectProperty')}</label>
          <select
            value={property}
            onChange={e => setProperty(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500"
          >
            <option value="">{t('selectProperty')}</option>
            {RENTAL_PROPERTIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        
        {/* Category */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">{t('category')}</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500"
          >
            <option value="">{t('category')}</option>
            {NOTE_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label[lang]}</option>
            ))}
          </select>
        </div>
        
        {/* Note */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">{t('note')}</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={t('notePlaceholder')}
            rows={4}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>
        
        {/* Photo */}
        <div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
          />
          
          {photo ? (
            <div className="relative">
              <img src={photo} alt="Preview" className="w-full rounded-xl max-h-48 object-cover" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 px-3 py-1 bg-black/60 rounded-lg text-sm"
              >
                {t('changePhoto')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-zinc-700 rounded-xl text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors"
            >
              {t('addPhoto')}
            </button>
          )}
        </div>
        
        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!property || !category || !note.trim() || sending}
          className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl font-medium transition-colors"
        >
          {sending ? t('sending') : t('send')}
        </button>
        
        {/* View Notes */}
        <button
          onClick={() => { loadRecentNotes(); setView('notes') }}
          className="w-full py-3 border border-zinc-700 rounded-xl text-zinc-400 hover:border-amber-500 hover:text-white transition-colors"
        >
          {t('viewNotes')}
        </button>
      </div>
    </div>
  )
}
