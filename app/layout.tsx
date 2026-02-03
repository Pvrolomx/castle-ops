import './globals.css'

export const metadata = {
  title: 'Castle Ops',
  description: 'Reporta y da seguimiento a incidencias de tu propiedad',
  manifest: '/manifest.json',
  themeColor: '#C9A227',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Castle Ops' },
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-castle-sand min-h-screen">
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center py-4 text-gray-400 text-sm">
          Made by <span className="text-castle-gold font-medium">duendes.app</span> — 2026
        </footer>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {})
          }
        `}} />
      </body>
    </html>
  )
}
