import './globals.css'
import Link from 'next/link'
import { Home, AlertTriangle, Users } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'Castle Ops - Operations Management',
  description: 'Incident and provider management for Castle Solutions'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="bg-castle-sand min-h-screen">
        <nav className="bg-castle-dark text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="Castle Solutions" className="h-10 w-auto brightness-200" />
                <span className="font-semibold text-lg">Castle Ops</span>
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 hover:text-castle-gold transition-colors">
                  <Home size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link href="/incidents" className="flex items-center gap-2 hover:text-castle-gold transition-colors">
                  <AlertTriangle size={18} />
                  <span className="hidden sm:inline">Incidents</span>
                </Link>
                <Link href="/providers" className="flex items-center gap-2 hover:text-castle-gold transition-colors">
                  <Users size={18} />
                  <span className="hidden sm:inline">Providers</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="text-center py-4 text-gray-500 text-sm">
          Made with ❤️ by <span className="text-castle-gold">duendes.app</span> — 2026
        </footer>
      </body>
    </html>
  )
}
