/* Service Worker (with offline page) for 困難拉圖斯計時器 */
const CACHE_VERSION = 'v1.1.0-with-offline';
const STATIC_CACHE = `ptimer-static-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './offline.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      for (const url of STATIC_ASSETS) {
        try { await cache.add(url); } catch (e) { /* ignore missing */ }
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // same-origin only

  const accept = req.headers.get('accept') || '';

  // HTML navigations: network-first + offline fallback
  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(STATIC_CACHE);
        cache.put('./', fresh.clone());
        return fresh;
      } catch (err) {
        return (await caches.match('./index.html'))
            || (await caches.match('./offline.html'))
            || new Response('離線狀態，尚未快取頁面。', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }});
      }
    })());
    return;
  }

  // Other requests: cache-first
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      const cache = await caches.open(STATIC_CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      return new Response('離線資源不可用', { status: 504 });
    }
  })());
});
