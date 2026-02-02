import './globals.css'

export const metadata = {
  title: 'Castle Ops - Operations Management',
  description: 'Incident and provider management for Castle Solutions'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-castle-sand min-h-screen">
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center py-4 text-gray-400 text-sm">
          Made by <span className="text-castle-gold font-medium">duendes.app</span> — 2026
        </footer>
      </body>
    </html>
  )
}
