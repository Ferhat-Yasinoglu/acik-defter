/* ==========================================================================
   Service worker — defteri bir kez açtıktan sonra ağsız da okunsun diye.

   İki strateji:
     HTML  → önce ağ, olmazsa önbellek.  İçerik taze kalır.
     geri kalan → önce önbellek, arkadan tazele.  Sayfa anında açılır.

   CACHE adındaki sürümü, yayına giren her değişiklikte artır: eski önbellek
   activate sırasında silinir, yoksa kullanıcıda iki sürüm birden birikir.
   ========================================================================== */

const CACHE = "acik-defter-v11";

const SHELL = [
  "./",
  "index.html",
  "yolculugum.html",
  "projeler.html",
  "notlar.html",
  "hakkimda.html",
  "gizlilik.html",
  "404.html",
  "css/style.css",
  "js/i18n.js",
  "js/site.js",
  "js/notes.js",
  "js/reveal.js",
  "img/wave.svg",
  "favicon.svg",
  "manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // Tek bir dosya düşerse kurulumun tamamı düşmesin.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Sayfalar: önce ağ. Çevrimdışıysak önbellekten, o da yoksa 404 sayfasından.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("404.html")))
    );
    return;
  }

  // Yazı tipleri dış kaynaktan geliyor; onları da tutuyoruz ki ağsız da düzgün görünsün.
  const cacheable = sameOrigin || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com");
  if (!cacheable) return;

  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok || res.type === "opaque") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
