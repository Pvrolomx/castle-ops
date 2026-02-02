'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { t, Lang } from '@/lib/i18n'
import Link from 'next/link'
import { AlertTriangle, Search, Lock } from 'lucide-react'

export default function Home() {
  const [lang, setLang] = useState<Lang>('es')

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8">
      {/* Lang Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="bg-white shadow-md rounded-full px-4 py-2 text-sm font-medium hover:shadow-lg transition-shadow">
          {lang === 'es' ? '🇺🇸 EN' : '🇲🇽 ES'}
        </button>
      </div>

      {/* Logo */}
      <img src="/logo.png" alt="Castle Solutions" className="h-24 w-auto" />

      {/* Main CTA */}
      <Link href={`/report?lang=${lang}`}
        className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-2xl text-2xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-4">
        <AlertTriangle size={32} />
        {t.reportIncident[lang]}
      </Link>

      {/* Secondary actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link href={`/track?lang=${lang}`}
          className="btn-secondary flex items-center gap-2">
          <Search size={20} />
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
