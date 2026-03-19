'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, X } from 'lucide-react'
import { Lang } from '@/lib/i18n'

type PropertyData = {
  name: string
  sections: { icon: string; title: { es: string; en: string; fr?: string }; content: { es: string; en: string; fr?: string }; videoUrl?: string }[]
}

const PROPERTY_DATA: Record<string, PropertyData> = {
  'villa-magna-253a': {
    name: 'Villa Magna 253 A',
    sections: [
      { icon: '📶', title: { es: 'WiFi', en: 'WiFi', fr: 'WiFi' }, content: { es: 'Red: VillaMagna253A\nContraseña: Pendiente', en: 'Network: VillaMagna253A\nPassword: Pending', fr: 'Réseau: VillaMagna253A\nMot de passe: En attente' } },
      { icon: '📺', title: { es: 'Televisión', en: 'Television', fr: 'Télévision' }, content: { es: 'Smart TV con Netflix, Prime Video y Disney+.\nUse el control remoto para cambiar entre apps.', en: 'Smart TV with Netflix, Prime Video and Disney+.\nUse the remote to switch between apps.', fr: 'Smart TV avec Netflix, Prime Video et Disney+.\nUtilisez la télécommande pour changer d\'application.' } },
      { icon: '🔐', title: { es: 'Caja Fuerte', en: 'Safe', fr: 'Coffre-fort' }, content: { es: 'Ubicada en el closet principal.\n1. Abra la puerta\n2. Ingrese un código de 4 dígitos\n3. Presione el botón verde\n4. Para abrir: ingrese su código y presione el botón verde', en: 'Located in the main closet.\n1. Open the door\n2. Enter a 4-digit code\n3. Press the green button\n4. To open: enter your code and press the green button', fr: 'Situé dans le placard principal.\n1. Ouvrez la porte\n2. Entrez un code à 4 chiffres\n3. Appuyez sur le bouton vert\n4. Pour ouvrir: entrez votre code et appuyez sur le bouton vert' } },
      { icon: '🚪', title: { es: 'Acceso / Puerta', en: 'Access / Door', fr: 'Accès / Porte' }, content: { es: 'Código de acceso: Pendiente\nLlave física disponible en recepción.', en: 'Access code: Pending\nPhysical key available at reception.', fr: 'Code d\'accès: En attente\nClé physique disponible à la réception.' } },
      { icon: '🅿️', title: { es: 'Estacionamiento', en: 'Parking', fr: 'Stationnement' }, content: { es: 'Cajón asignado en sótano.\nUse su tarjeta de acceso para ingresar.', en: 'Assigned spot in basement.\nUse your access card to enter.', fr: 'Place assignée au sous-sol.\nUtilisez votre carte d\'accès pour entrer.' } },
      { icon: '🏊', title: { es: 'Amenidades', en: 'Amenities', fr: 'Commodités' }, content: { es: 'Alberca: 7am - 10pm\nGym: 6am - 10pm\nÁrea de asadores: 8am - 10pm', en: 'Pool: 7am - 10pm\nGym: 6am - 10pm\nBBQ area: 8am - 10pm', fr: 'Piscine: 7h - 22h\nGym: 6h - 22h\nAire de barbecue: 8h - 22h' } },
      { icon: '🍽️', title: { es: 'Restaurantes Cercanos', en: 'Nearby Restaurants', fr: 'Restaurants à Proximité' }, content: { es: '• La Leche - Cocina de autor\n• Tintoque - Mexicana contemporánea\n• Porto Bello - Italiana\n• Mariscos 8 Tostadas - Mariscos', en: '• La Leche - Author cuisine\n• Tintoque - Contemporary Mexican\n• Porto Bello - Italian\n• Mariscos 8 Tostadas - Seafood', fr: '• La Leche - Cuisine d\'auteur\n• Tintoque - Mexicain contemporain\n• Porto Bello - Italien\n• Mariscos 8 Tostadas - Fruits de mer' } },
      { icon: '🚕', title: { es: 'Transporte', en: 'Transportation', fr: 'Transport' }, content: { es: 'Uber y Didi disponibles en la zona.\nTaxi seguro: Solicitar en recepción.\nRenta de auto: Consulte en recepción.', en: 'Uber and Didi available in the area.\nSafe taxi: Request at reception.\nCar rental: Ask at reception.', fr: 'Uber et Didi disponibles dans la zone.\nTaxi sûr: Demandez à la réception.\nLocation de voiture: Demandez à la réception.' } },
      { icon: '🏥', title: { es: 'Emergencias', en: 'Emergencies', fr: 'Urgences' }, content: { es: 'Emergencias: 911\nCruz Roja: 322-222-1533\nHospital CMQ: 322-223-1919\nFarmacia Guadalajara: 322-224-1100', en: 'Emergencies: 911\nRed Cross: 322-222-1533\nCMQ Hospital: 322-223-1919\nPharmacia Guadalajara: 322-224-1100', fr: 'Urgences: 911\nCroix-Rouge: 322-222-1533\nHôpital CMQ: 322-223-1919\nPharmacie Guadalajara: 322-224-1100' } },
      { icon: '♻️', title: { es: 'Basura y Reciclaje', en: 'Trash & Recycling', fr: 'Déchets & Recyclage' }, content: { es: 'Deposite la basura en el contenedor del pasillo.\nSeparar orgánico e inorgánico.', en: 'Place trash in the hallway container.\nSeparate organic and inorganic waste.', fr: 'Déposez les déchets dans le conteneur du couloir.\nSéparez les déchets organiques et inorganiques.' } },
      { icon: '📞', title: { es: 'Contacto Castle Solutions', en: 'Contact Castle Solutions', fr: 'Contact Castle Solutions' }, content: { es: 'WhatsApp: +52 322 XXX XXXX\nEmail: info@castlesolutions.mx\nEmergencia 24/7 disponible', en: 'WhatsApp: +52 322 XXX XXXX\nEmail: info@castlesolutions.mx\n24/7 Emergency available', fr: 'WhatsApp: +52 322 XXX XXXX\nEmail: info@castlesolutions.mx\nUrgence 24/7 disponible' } },
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
  const [lang, setLang] = useState<Lang>(langParam as Lang)
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [showBanner, setShowBanner] = useState(true)

  const data = getPropertyData(slug)

  const quickIcons = data.sections.slice(0, 4)

  const welcomeTexts = {
    hello: { es: '¡Hola', en: 'Hello', fr: 'Bonjour' },
    welcome: { es: 'Bienvenido(a) a Puerto Vallarta', en: 'Welcome to Puerto Vallarta', fr: 'Bienvenue à Puerto Vallarta' },
    intro: { es: 'Esperamos hacer de tu estancia una experiencia inolvidable. Aquí tienes todo lo que necesitas.', en: 'We hope to make your stay an unforgettable experience. Here\'s everything you need.', fr: 'Nous espérons faire de votre séjour une expérience inoubliable. Voici tout ce dont vous avez besoin.' },
    guide: { es: 'Tu Guía Personal', en: 'Your Personal Guide', fr: 'Votre Guide Personnel' },
    report: { es: 'Reportar un Problema', en: 'Report an Issue', fr: 'Signaler un Problème' },
    operated: { es: 'Operado por', en: 'Operated by', fr: 'Géré par' },
    help: { es: '¿Necesitas ayuda? Toca "Contacto" arriba', en: 'Need help? Tap "Contact" above', fr: 'Besoin d\'aide? Appuyez sur "Contact" ci-dessus' }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Castle Solutions" className="h-20 w-auto" />
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>🇲🇽</button>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>🇺🇸</button>
            <button className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => setLang('fr')}>🇫🇷</button>
          </div>
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
              {welcomeTexts.hello[lang]}, {guestName}!
            </h2>
            <p className="text-castle-gold font-medium text-lg mb-2">
              {welcomeTexts.welcome[lang]}
            </p>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
              {welcomeTexts.intro[lang]}
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
            {welcomeTexts.guide[lang]}
          </h1>
        </div>

        {/* Quick access icons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickIcons.map((s, i) => (
            <button key={i} onClick={() => setOpenSection(openSection === i ? null : i)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all bg-gray-50 hover:bg-gray-100">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">{s.title[lang] || s.title.en}</span>
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
                <span className="font-medium text-gray-800 flex-1">{section.title[lang] || section.title.en}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openSection === i ? 'rotate-180' : ''}`} />
              </button>
              {openSection === i && (
                <div className="px-4 pb-4 bg-gray-50">
                  <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{section.content[lang] || section.content.en}</p>
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
            ⚠️ {welcomeTexts.report[lang]}
          </a>
        </div>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-xs text-gray-400">
            {welcomeTexts.operated[lang]} <span className="text-castle-gold font-medium">Castle Solutions</span>
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {welcomeTexts.help[lang]}
          </p>
        </div>
      </div>
    </div>
  )
}

