const CACHE_NAME = '4d-takki-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/game.html', 
  '/rules.html',
  '/script.js',
  '/style.css',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});