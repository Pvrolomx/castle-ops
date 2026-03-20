const CACHE_NAME = 'castle-ops-v3'
const ASSETS = ['/', '/manifest.json', '/logo.png', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  
  // Network-first para HTML y API
  if (e.request.url.includes('/api/') || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r.ok) {
            const c = r.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, c))
          }
          return r
        })
        .catch(() => caches.match(e.request))
    )
  } else {
    // Cache-first para assets
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    )
  }
})
