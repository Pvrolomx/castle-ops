'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { t, Lang } from '@/lib/i18n'
import Link from 'next/link'
import { AlertTriangle, Search, Lock, ClipboardList } from 'lucide-react'

export default function Home() {
  const [lang, setLang] = useState<Lang>('es')

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
      <div className="fixed top-4 right-4 z-50">
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="bg-white shadow-md rounded-full px-4 py-2 text-sm font-medium hover:shadow-lg transition-shadow">
          {lang === 'es' ? '🇺🇸 EN' : '🇲🇽 ES'}
        </button>
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
