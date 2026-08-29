# Açık Defter

Kişisel sitem ve öğrenme günlüğüm — <https://ferhat-yasinoglu.github.io/acik-defter/>

Çerçeve yok, derleme adımı yok, paket bağımlılığı yok. Düz HTML, CSS ve
JavaScript; GitHub Pages dosyaları olduğu gibi yayınlıyor.

## Neler var

- **Dört dil** — Türkçe, İngilizce, Almanca, Farsça. Metinlerin tamamı
  `js/i18n.js` içindeki tek bir sözlükte duruyor; Farsça seçilince sayfanın
  yönü sağdan sola dönüyor.
- **Açık / koyu tema** — tercih `localStorage`'da, hiç seçim yapılmamışsa
  işletim sisteminin tercihi izleniyor.
- **Çevrimdışı okuma** — bir service worker sayfaları ve varlıkları
  önbelleğe alıyor; site bir kez açıldıktan sonra ağ olmadan da açılıyor.
- **JavaScript kapalıyken de çalışır** — açılır bölümler `<details>`
  olduğu için içerik her koşulda okunabiliyor. JavaScript yalnızca dil,
  tema ve not süzgeci için gerekiyor.

## Dosyalar

```
index.html  yolculugum.html  projeler.html  notlar.html  hakkimda.html
404.html                     bulunamayan adresler
ogrenme.html  iletisim.html  eski adresler için yönlendirme

css/style.css   tek stil dosyası
js/i18n.js      dört dilin sözlüğü
js/site.js      dil, tema, dil menüsü
js/notes.js     notlar sayfasındaki süzgeç
sw.js           service worker

tools/check.mjs        tutarlılık denetimi (aşağıya bak)
tools/test.mjs         tarayıcı testleri
tools/make-images.mjs  ikonlar ve paylaşım görseli
```

Sayfaların üst ve alt kısmı (başlık, gezinme, altbilgi) her dosyada elle
duruyor. Derleme adımı olmamasının bedeli bu; karşılığında yayınlamak için
hiçbir araca ihtiyaç yok.

## Geliştirme

Sunucuya gerek yok, `index.html` doğrudan açılabilir — ama service worker
ve `fetch` yalnızca `http://` üzerinden çalışır:

```sh
npx http-server -p 8080 .
```

Bir şey değiştirdikten sonra:

```sh
node tools/check.mjs
```

Bu script, elle bakınca gözden kaçan tutarsızlıkları arıyor:

1. Başlık ve altbilgi bütün sayfalarda birebir aynı mı
2. Dört sözlük de aynı anahtarları taşıyor mu
3. HTML'de kullanılan her `data-i18n` anahtarı sözlükte var mı
4. Yer tutucu bağlantı kalmış mı (`example.com`, `YOUR_ID`, boş profil adresi)
5. Site içi bağlantılar ve `#çapalar` gerçekten bir yere gidiyor mu
6. `sitemap.xml` ve service worker listesi sayfalarla uyuşuyor mu

Bir de siteyi gerçekten bir tarayıcıda açan testler var:

```sh
npm i -D playwright && npx playwright install chromium
node tools/test.mjs
```

Süzgeci, açılır bölümleri, tema ve dilin sayfa geçişinde korunmasını,
JavaScript kapalıyken sayfanın okunabilirliğini, klavyeyle gezinmeyi ve
service worker'ın çevrimdışı gerçekten çalıştığını denetler. Kendi statik
sunucusunu açar, ayrıca bir şey çalıştırmak gerekmez.

Her iki script de her push'ta GitHub Actions'ta çalışıyor.

### İkonları yeniden üretmek

Ambleme ya da renklere dokunduysan:

```sh
npm i -D playwright && npx playwright install chromium
node tools/make-images.mjs
```

`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`,
`apple-touch-icon.png` ve `og.png` dosyalarını yeniden yazar. Çıktılar
depoya commit'lenir; siteyi yayınlamak için bu adım gerekmez.

### Bir şey değiştirince

- Yeni sayfa eklersen: `tools/check.mjs` içindeki `PAGES`, `sitemap.xml`
  ve `sw.js` içindeki `SHELL` listesine de ekle — script unutursan söyler.
- Yayına giren her değişiklikten sonra `sw.js` içindeki `CACHE` sürümünü
  artır, yoksa kullanıcıda eski sürüm kalır.

## Lisans

Kod [MIT](LICENSE). Yazılar bana ait.
