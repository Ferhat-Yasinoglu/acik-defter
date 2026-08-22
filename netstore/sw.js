/* ==========================================================================
   NetStore — servis çalışanı (offline katmanı)

   Uygulamanın tüm dosyaları kuruluşta önbelleğe alınır; sonrasında internet
   olmadan da açılır. Her istek önce önbellekten karşılanır, arka planda
   sessizce tazelenir (stale-while-revalidate) — böylece uygulama açılışta
   beklemez ama bir sonraki açılışta güncel sürüme geçer.

   Sürüm değiştiğinde eski önbellek silinir: dosyalarda değişiklik yaptıktan
   sonra CACHE sabitindeki numarayı artırmak yeterlidir.
   ========================================================================== */

const CACHE = 'netstore-v11';

/* Uygulama kabuğu — hepsi kuruluşta indirilir. */
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/netstore.css',
  './css/fonts.css',
  './fonts/inter-latin.woff2',
  './fonts/inter-latin-ext.woff2',
  './fonts/vazirmatn-arabic.woff2',
  './fonts/vazirmatn-latin.woff2',
  './js/i18n.js',
  './js/pwa.js',
  './js/icons.js',
  './js/data.js',
  './js/store.js',
  './js/firebase-config.js',
  './vendor/firebase.js',
  './js/cloud.js',
  './js/auth.js',
  './js/charts.js',
  './js/invoice.js',
  './js/forms.js',
  './js/search.js',
  './js/app.js',
  './icons/logo-128.png',
  './icons/favicon-64.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;

  /* Yalnızca kendi dosyalarımız ve yalnızca okuma istekleri. */
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  /* Sayfa gezintisi: çevrimdışıyken her zaman index.html dönsün —
     uygulama zaten karma (#) tabanlı yönlendirme kullanıyor. */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      const live = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || live;
    })
  );
});
