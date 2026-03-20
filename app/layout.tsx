import './globals.css'

export const metadata = {
  title: 'Castle Solutions Maintenance',
  description: 'Report and track property maintenance issues',
  manifest: '/manifest.json',
  themeColor: '#C9A227',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Castle Maintenance' },
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon-192.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-castle-sand min-h-screen">
        {/* Install Button - Fixed Bottom */}
        <div id="install-container" className="hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <button id="install-btn" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg text-sm font-medium transition-all">
            <span>📲</span> Instalar App
          </button>
        </div>
        
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center py-4 text-gray-400 text-sm">
          Made by <span className="text-castle-gold font-medium">Colmena</span> — 2026
        </footer>
        <script dangerouslySetInnerHTML={{ __html: `
          // Service Worker
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {})
          }
          
          // PWA Install Prompt
          let deferredPrompt;
          window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('install-container').classList.remove('hidden');
          });
          
          document.getElementById('install-btn')?.addEventListener('click', () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(r => {
              if (r.outcome === 'accepted') {
                document.getElementById('install-container').classList.add('hidden');
              }
              deferredPrompt = null;
            });
          });
          
          window.addEventListener('appinstalled', () => {
            document.getElementById('install-container').classList.add('hidden');
          });
        `}} />
      </body>
    </html>
  )
}
