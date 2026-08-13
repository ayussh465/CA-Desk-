// CA Desk — Service Worker
// Caches the app shell so the UI loads instantly on repeat visits.
// NOTE: CA Desk's own app logic requires a live internet connection to run
// (see the connectivity gate in index.html), so this worker only caches
// static shell assets for fast loading — it does not attempt to make the
// app "work offline" end-to-end.

const CACHE_NAME = 'ca-desk-cache-v2';
const OFFLINE_URL = './offline.html';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests — let cross-origin requests
  // (ad scripts, fonts, connectivity pings, APIs) go straight to the network.
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Full-page navigations get an offline fallback page if the network
  // fails and nothing cached matches (e.g. first visit while offline).
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((cached) =>
          cached || caches.match(OFFLINE_URL)
        )
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache a copy of newly fetched shell assets for next time.
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => cached);
    })
  );
});

// Lets index.html trigger an immediate update (e.g. from an "Update
// available" prompt) instead of waiting for all tabs to close.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
