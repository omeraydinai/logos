// Logos service worker — çevrimdışı destek
const CACHE = 'logos-v4';
const PRECACHE = [
  './',
  './index.html',
  './app.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './sorular/manifest.json',
  './felsefe/filozoflar.json',
  './felsefe/akimlar.json',
  './felsefe/sozluk.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Ağ öncelikli: güncel sürüm varsa onu al ve önbelleği tazele;
// ağ yoksa önbellekten sun. Fontlar gibi üçüncü taraf istekler önbellek öncelikli.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  if (url.origin === location.origin) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  }
});
