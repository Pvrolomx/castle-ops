'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { t, Lang } from '@/lib/i18n'
import Link from 'next/link'
import { AlertTriangle, Search, Lock, ClipboardList } from 'lucide-react'


// ── Tutorial Modal ────────────────────────────────────────────────────────────
function HelpModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const steps = {
    es: [
      { icon: '🌐', title: 'Abre la app', desc: 'Entra a castle-ops.castlesolutions.mx desde tu celular. La primera vez aparece un botón azul "📲 Instalar App" — úsalo para tenerla en tu pantalla de inicio.' },
      { icon: '🚨', title: 'Toca "Reportar Incidencia"', desc: 'En la pantalla principal verás el botón verde. Al tocarlo te preguntará quién eres: Propietario (ingresa tu PIN de 4 dígitos) o Huésped (ingresa tu código de reservación).' },
      { icon: '📝', title: 'Llena el reporte', desc: 'Selecciona la categoría (Plomería, Electricidad, Limpieza, A/C, etc.), el nivel de urgencia, escribe una descripción y adjunta fotos si puedes (hasta 3).' },
      { icon: '✅', title: 'Envía', desc: 'Toca "Enviar Reporte". El equipo de Castle Solutions recibe una notificación inmediata y te contacta directamente para coordinar la solución.' },
    ],
    en: [
      { icon: '🌐', title: 'Open the app', desc: 'Go to castle-ops.castlesolutions.mx on your phone. The first time, a blue "📲 Install App" button appears — tap it to add it to your home screen.' },
      { icon: '🚨', title: 'Tap "Report an Issue"', desc: 'On the main screen tap the green button. You will be asked who you are: Owner (enter your 4-digit PIN) or Guest (enter your reservation code).' },
      { icon: '📝', title: 'Fill out the report', desc: 'Select the category (Plumbing, Electrical, Cleaning, A/C, etc.), urgency level, write a description and attach photos if possible (up to 3).' },
      { icon: '✅', title: 'Submit', desc: 'Tap "Submit Report". The Castle Solutions team receives an immediate notification and contacts you directly to coordinate the solution.' },
    ],
    fr: [
      { icon: '🌐', title: "Ouvrez l'app", desc: 'Allez sur castle-ops.castlesolutions.mx depuis votre téléphone. La première fois, un bouton bleu "📲 Installer l'App" apparaît — appuyez dessus pour l'ajouter à votre écran d'accueil.' },
      { icon: '🚨', title: 'Appuyez sur "Signaler un Problème"', desc: 'Sur l'écran principal appuyez sur le bouton vert. On vous demandera qui vous êtes: Propriétaire (entrez votre PIN à 4 chiffres) ou Hôte (entrez votre code de réservation).' },
      { icon: '📝', title: 'Remplissez le rapport', desc: 'Sélectionnez la catégorie (Plomberie, Électricité, Nettoyage, A/C, etc.), le niveau d'urgence, écrivez une description et joignez des photos si possible (jusqu'à 3).' },
      { icon: '✅', title: 'Envoyez', desc: 'Appuyez sur "Envoyer". L'équipe de Castle Solutions reçoit une notification immédiate et vous contacte directement pour coordonner la solution.' },
    ],
  }

  const labels = {
    es: { title: 'Cómo Reportar un Problema', emergency: '📞 Emergencia real (inundación, incendio, corte total): llama directo al WhatsApp de Castle Solutions, no esperes el reporte.', download: '📄 Descargar PDF', close: 'Cerrar' },
    en: { title: 'How to Report an Issue', emergency: '📞 Real emergency (flooding, fire, total power outage): call Castle Solutions WhatsApp directly — do not wait for the report.', download: '📄 Download PDF', close: 'Close' },
    fr: { title: 'Comment Signaler un Problème', emergency: '📞 Urgence réelle (inondation, incendie, coupure totale): appelez directement le WhatsApp de Castle Solutions — n'attendez pas le rapport.', download: '📄 Télécharger PDF', close: 'Fermer' },
  }

  const l = labels[lang]
  const s = steps[lang]

  const downloadPDF = () => {
    const content = `CASTLE SOLUTIONS — ${l.title}\n\n` +
      s.map((step, i) => `${i+1}. ${step.title}\n   ${step.desc}`).join('\n\n') +
      `\n\n⚠️  ${l.emergency}\n\ncastle-ops.castlesolutions.mx`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'castle-solutions-guide.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">🏰 {l.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4">
          {s.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl">{step.icon}</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{i+1}. {step.title}</p>
                <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 mt-2">
            {l.emergency}
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button onClick={downloadPDF} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            {l.download}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
            {l.close}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [lang, setLang] = useState<Lang>('es')
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
      {showHelp && <HelpModal lang={lang} onClose={() => setShowHelp(false)} />}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button onClick={() => setShowHelp(true)} className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-400 transition-all text-sm font-bold" title="Tutorial">❓</button>
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>🇲🇽</button>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>🇺🇸</button>
          <button className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => setLang('fr')}>🇫🇷</button>
        </div>
      </div>

      <img src="/logo.png" alt="Castle Solutions" className="h-24 w-auto" />

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/report?type=owner&lang=${lang}`}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl text-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3">
          <AlertTriangle size={28} />
          {t.reportIncident[lang]}
        </Link>

        <Link href={`/request?type=owner&lang=${lang}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3">
          <ClipboardList size={28} />
          {t.requestService[lang]}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link href={`/track?lang=${lang}`}
          className="bg-white border-2 border-castle-gold text-castle-dark px-6 py-3 rounded-xl font-medium hover:bg-amber-50 transition-all flex items-center gap-2 shadow-sm">
          <Search size={20} className="text-castle-gold" />
          {t.checkStatus[lang]}
        </Link>
        <Link href={`/admin?lang=${lang}`}
          className="text-gray-400 hover:text-gray-600 flex items-center gap-2 px-6 py-3 transition-colors">
          <Lock size={16} />
          {t.admin[lang]}
        </Link>
      </div>
    </div>
  )
}

