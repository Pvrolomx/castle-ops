import './globals.css'
import Link from 'next/link'
import { Home, AlertTriangle, Users } from 'lucide-react'

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
        <header className="bg-white shadow-sm">
          {/* Logo centrado */}
          <div className="flex justify-center py-6">
            <Link href="/">
              <img src="/logo.png" alt="Castle Solutions" className="h-20 w-auto" />
            </Link>
          </div>
          
          {/* Nav debajo */}
          <nav className="border-t border-gray-200 bg-castle-dark">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-center gap-8 h-12 text-white">
                <Link href="/" className="flex items-center gap-2 hover:text-castle-gold transition-colors">
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link href="/incidents" className="flex items-center gap-2 hover:text-castle-gold transition-colors">
                  <AlertTriangle size={18} />
                  <span>Incidencias</span>
                </Link>
                <Link href="/providers" className="flex items-center gap-2 hover:text-castle-gold transition-colors">
                  <Users size={18} />
                  <span>Proveedores</span>
                </Link>
              </div>
            </div>
          </nav>
        </header>
        
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
