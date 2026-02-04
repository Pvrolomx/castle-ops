'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, X } from 'lucide-react'

type PropertyData = {
  name: string
  sections: { icon: string; title: { es: string; en: string }; content: { es: string; en: string }; videoUrl?: string }[]
}

const PROPERTY_DATA: Record<string, PropertyData> = {
  'villa-magna-253a': {
    name: 'Villa Magna 253 A',
    sections: [
      { icon: '📶', title: { es: 'WiFi', en: 'WiFi' }, content: { es: 'Red: VillaMagna253A\nContraseña: Pendiente', en: 'Network: VillaMagna253A\nPassword: Pending' } },
      { icon: '📺', title: { es: 'Televisión', en: 'Television' }, content: { es: 'Smart TV con Netflix, Prime Video y Disney+.\nUse el control remoto para cambiar entre apps.', en: 'Smart TV with Netflix, Prime Video and Disney+.\nUse the remote to switch between apps.' } },
      { icon: '🔐', title: { es: 'Caja Fuerte', en: 'Safe' }, content: { es: 'Ubicada en el closet principal.\n1. Abra la puerta\n2. Ingrese un código de 4 dígitos\n3. Presione el botón verde\n4. Para abrir: ingrese su código y presione el botón verde', en: 'Located in the main closet.\n1. Open the door\n2. Enter a 4-digit code\n3. Press the green button\n4. To open: enter your code and press the green button' } },
      { icon: '🚪', title: { es: 'Acceso / Puerta', en: 'Access / Door' }, content: { es: 'Código de acceso: Pendiente\nLlave física disponible en recepción.', en: 'Access code: Pending\nPhysical key available at reception.' } },
      { icon: '🅿️', title: { es: 'Estacionamiento', en: 'Parking' }, content: { es: 'Cajón asignado en sótano.\nUse su tarjeta de acceso para ingresar.', en: 'Assigned spot in basement.\nUse your access card to enter.' } },
      { icon: '🏊', title: { es: 'Amenidades', en: 'Amenities' }, content: { es: 'Alberca: 7am - 10pm\nGym: 6am - 10pm\nÁrea de asadores: 8am - 10pm', en: 'Pool: 7am - 10pm\nGym: 6am - 10pm\nBBQ area: 8am - 10pm' } },
      { icon: '🍽️', title: { es: 'Restaurantes Cercanos', en: 'Nearby Restaurants' }, content: { es: '• La Leche - Cocina de autor\n• Tintoque - Mexicana contemporánea\n• Porto Bello - Italiana\n• Mariscos 8 Tostadas - Mariscos', en: '• La Leche - Author cuisine\n• Tintoque - Contemporary Mexican\n• Porto Bello - Italian\n• Mariscos 8 Tostadas - Seafood' } },
      { icon: '🚕', title: { es: 'Transporte', en: 'Transportation' }, content: { es: 'Uber y Didi disponibles en la zona.\nTaxi seguro: Solicitar en recepción.\nRenta de auto: Consulte en recepción.', en: 'Uber and Didi available in the area.\nSafe taxi: Request at reception.\nCar rental: Ask at reception.' } },
      { icon: '🏥', title: { es: 'Emergencias', en: 'Emergencies' }, content: { es: 'Emergencias: 911\nCruz Roja: 322-222-1533\nHospital CMQ: 322-223-1919\nFarmacia Guadalajara: 322-224-1100', en: 'Emergencies: 911\nRed Cross: 322-222-1533\nCMQ Hospital: 322-223-1919\nPharmacia Guadalajara: 322-224-1100' } },
      { icon: '♻️', title: { es: 'Basura y Reciclaje', en: 'Trash & Recycling' }, content: { es: 'Deposite la basura en el contenedor del pasillo.\nSeparar orgánico e inorgánico.', en: 'Place trash in the hallway container.\nSeparate organic and inorganic waste.' } },
      { icon: '📞', title: { es: 'Contacto Castle Solutions', en: 'Contact Castle Solutions' }, content: { es: 'WhatsApp: +52 322 XXX XXXX\nEmail: info@castlesolutions.mx\nEmergencia 24/7 disponible', en: 'WhatsApp: +52 322 XXX XXXX\nEmail: info@castlesolutions.mx\n24/7 Emergency available' } },
    ]
  }
}

// Default data for properties not yet configured
const DEFAULT_SECTIONS = (name: string) => PROPERTY_DATA['villa-magna-253a'].sections.map(s => ({...s}))

function getPropertyData(slug: string): PropertyData {
  if (PROPERTY_DATA[slug]) return PROPERTY_DATA[slug]
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return { name, sections: DEFAULT_SECTIONS(name) }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const slug = params.slug
  const guestName = searchParams.get('guest') || ''
  const langParam = searchParams.get('lang') || 'es'
  const [lang, setLang] = useState<'es' | 'en'>(langParam as 'es' | 'en')
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [showBanner, setShowBanner] = useState(true)

  const data = getPropertyData(slug)

  const quickIcons = data.sections.slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Castle Solutions" className="h-20 w-auto" />
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm font-medium text-gray-700">
            <span className="text-base">{lang === 'es' ? '🇲🇽' : '🇺🇸'}</span>
            {lang === 'es' ? 'ES' : 'EN'}
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome Banner */}
        {guestName && showBanner && (
          <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-castle-dark via-gray-900 to-castle-dark p-6 text-center shadow-lg">
            <button onClick={() => setShowBanner(false)} className="absolute top-3 right-3 text-white/40 hover:text-white/70 transition">
              <X className="w-5 h-5" />
            </button>
            <div className="text-castle-gold text-3xl mb-2">🏰</div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {lang === 'es' ? `¡Hola, ${guestName}!` : `Hello, ${guestName}!`}
            </h2>
            <p className="text-castle-gold font-medium text-lg mb-2">
              {lang === 'es' ? 'Bienvenido(a) a Puerto Vallarta' : 'Welcome to Puerto Vallarta'}
            </p>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
              {lang === 'es' 
                ? 'Esperamos hacer de tu estancia una experiencia inolvidable. Aquí tienes todo lo que necesitas.'
                : 'We hope to make your stay an unforgettable experience. Here\'s everything you need.'}
            </p>
            <div className="mt-3 flex justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-castle-gold/60"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-castle-gold"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-castle-gold/60"></span>
            </div>
          </div>
        )}

        {/* Property title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-castle-gold/10 rounded-full mb-3">
            <span className="text-castle-gold text-sm font-semibold">🏠 {data.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lang === 'es' ? 'Tu Guía Personal' : 'Your Personal Guide'}
          </h1>
        </div>

        {/* Quick access icons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickIcons.map((s, i) => (
            <button key={i} onClick={() => setOpenSection(openSection === i ? null : i)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all bg-gray-50 hover:bg-gray-100">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">{s.title[lang]}</span>
            </button>
          ))}
        </div>

        {/* Accordion sections */}
        <div className="space-y-2">
          {data.sections.map((section, i) => (
            <div key={i} className="rounded-xl overflow-hidden transition-all border border-gray-100">
              <button onClick={() => setOpenSection(openSection === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors bg-white hover:bg-gray-50">
                <span className="text-xl flex-shrink-0">{section.icon}</span>
                <span className="font-medium text-gray-800 flex-1">{section.title[lang]}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openSection === i ? 'rotate-180' : ''}`} />
              </button>
              {openSection === i && (
                <div className="px-4 pb-4 bg-gray-50">
                  <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{section.content[lang]}</p>
                  {section.videoUrl && (
                    <div className="mt-3">
                      <a href={section.videoUrl} target="_blank" rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-castle-gold text-sm font-medium">
                        ▶ Video
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Report issue button */}
        <div className="mt-8 mb-6">
          <a href={`/report?type=renter&property=${encodeURIComponent(data.name)}&lang=${lang}`}
            className="block w-full text-center bg-castle-gold text-white font-semibold py-3.5 rounded-xl hover:bg-yellow-600 transition-colors shadow-sm">
            ⚠️ {lang === 'es' ? 'Reportar un Problema' : 'Report an Issue'}
          </a>
        </div>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-xs text-gray-400">
            {lang === 'es' ? 'Operado por' : 'Operated by'} <span className="text-castle-gold font-medium">Castle Solutions</span>
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {lang === 'es' ? '¿Necesitas ayuda? Toca "Contacto" arriba' : 'Need help? Tap "Contact" above'}
          </p>
        </div>
      </div>
    </div>
  )
}
