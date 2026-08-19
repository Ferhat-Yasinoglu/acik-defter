# NetStore — Stok, Satış, Müşteri, Borç & Tahsilat Paneli

Modern dark SaaS dashboard estetiğinde, bağımlılıksız (vanilla HTML/CSS/JS) bir
yönetim paneli arayüzü. Derleme adımı yok — `netstore/index.html` doğrudan
tarayıcıda açılır.

**Üç dil:** دری (Farsça) · Türkçe · English. Seçilen dil arayüzün tamamını,
faturaları ve tahsilat fişlerini kapsar; Farsça seçildiğinde düzen sağdan sola
döner, rakamlar Fars rakamlarına (۰۱۲۳) geçer.

**Para birimi:** Afgani — Farsça `افغانی`, Türkçe/İngilizce `AFN`.

> **Not:** Bu, mevcut bir uygulamanın yeniden tasarımı değil, sıfırdan kurulmuş
> bir arayüz katmanıdır. Örnek veri seti `js/data.js` içindedir; kendi veri
> kaynağınıza bağlarken yalnızca o dosyayı değiştirmeniz yeterlidir.

## Dosya yapısı

| Dosya | Sorumluluk |
|---|---|
| `index.html` | Uygulama kabuğu: kenar çubuğu, üst bar, belge/modal/bildirim yuvaları |
| `css/netstore.css` | Tasarım sistemi: tokenlar, bileşenler, RTL, responsive, baskı |
| `js/i18n.js` | **Sözlük + dil çalışma zamanı**: çeviri, yön, sayı/para/tarih biçimi |
| `js/icons.js` | Satır içi SVG ikon seti (CDN bağımlılığı yok, çevrimdışı çalışır) |
| `js/data.js` | Örnek veri + **tüm türetilmiş hesaplar** (KPI, durum, bakiye, seriler) |
| `js/charts.js` | SVG grafik motoru: sparkline, çizgi/alan, yığılmış çubuk, yatay çubuk |
| `js/invoice.js` | Fatura ve tahsilat fişi belgeleri (seçili dilde, basılabilir) |
| `js/app.js` | Yönlendirme (hash router), sayfa şablonları, etkileşimler |

## Çok dillilik

Kayıtlarda **etiket anahtarı** tutulur (`'phone'`, `'cash'`, `'manager'`), ekranda
çevrilir. Özel adlar ve adresler iki yazımda saklanır:

```js
{ first:{ en:'Ahmad', fa:'احمد' }, addr:{ en:'Shar-e Naw, Kabul', fa:'شهر نو، کابل' } }
```

Marka adları (iPhone 15 Pro, MacBook Air) her dilde Latin yazımda kalır — Farsça
kataloglarda da böyle yazılır.

| Konu | Davranış |
|---|---|
| Yön | `fa` → `dir="rtl"`, düzen mantıksal özelliklerle (`margin-inline-start` vb.) döner |
| Yazı tipi | RTL'de Vazirmatn, LTR'de Inter |
| Rakamlar | `fa` → ۰۱۲۳۴۵۶۷۸۹, diğerlerinde Latin |
| Tarih | Her dilde **GG/AA/YYYY** (tr'de `GG.AA.YYYY`), miladi takvim |
| Grafikler | Zaman ekseni RTL'de de soldan sağa akar (`.chart-wrap.ltr`) |
| Telefon/vergi no | `ltr()` ile yön yalıtımı — RTL'de sırası bozulmaz |

Dil `localStorage` içinde `netstore-lang` anahtarıyla saklanır; ilk açılışta
tarayıcı diline göre seçilir. Değiştirmek için üst bardaki `فا / TR / EN` düğmeleri
veya Ayarlar sayfası.

**Not — tarih biçimi:** ICU'nun `fa-AF` kalıbı miladi tarihi `AA/GG/YYYY` üretiyor
ve bu Afganistan'da yanlış okunuyor; bu yüzden sıra `i18n.js` içindeki `fmtDate`
fonksiyonunda elle kurulur. Hicri-şemsi takvim istenirse aynı fonksiyonda
`calendar:'persian'` yeterlidir.

## Fatura ve tahsilat fişi

`js/invoice.js` iki belge üretir; ikisi de seçili dilde, Afgani cinsinden ve
yazdırmaya hazırdır:

- **Fatura** (`invoiceDoc(saleId)`) — satıcı/alıcı blokları, kalem tablosu,
  ara toplam / genel toplam / tahsil edilen / kalan borç, o faturaya ait tahsilat
  hareketleri, durum ve imza alanları.
- **Tahsilat fişi** (`receiptDoc(paymentId)`) — tek bir ödeme hareketi ve
  faturanın güncel bakiyesi.

Belge koyu arayüz üzerinde beyaz kâğıt olarak açılır. `Yazdır / PDF` düğmesi
yalnızca kâğıdı basar; arayüz, araç çubuğu ve kenar çubuğu baskıya girmez.

## Renk sistemi

Tasarımın yaklaşık **%80'i nötr yüzey**, **%20'si vurgu** rengidir. Renk yalnızca
bir anlam taşıdığında kullanılır.

| Rol | Değer |
|---|---|
| Arka plan | `#0B1120` |
| Kart | `#111827` |
| İkincil kart | `#151D2E` |
| Ana vurgu / hover | `#7C3AED` / `#8B5CF6` |
| Başarı, ödenen | `#22C55E` |
| Borç, gecikme | `#EF4444` |
| Uyarı, yaklaşan vade | `#F59E0B` |
| Bilgi | `#3B82F6` |
| Ana / ikincil yazı | `#FFFFFF` / `#94A3B8` |

Grafik serileri (`#8B5CF6` satış, `#16A34A` kâr) renk körlüğü ayrımı ve yüzey
kontrastı açısından ayrıca doğrulanmıştır; bu yüzden arayüzdeki `--success`
tonundan bir adım koyudurlar.

## Veri mantığı

Hiçbir toplam elle yazılmamıştır; her şey `SALES`, `PAYMENTS`, `PURCHASES`,
`PRODUCTS` kayıtlarından hesaplanır:

- `saleTotals(sale)` — toplam, maliyet, kâr, tahsil edilen, kalan
- `saleStatus(sale)` — Tamamlandı / Kısmi Ödeme / Ödeme Bekliyor / Gecikti
- `customerSummary(id)` — müşteri bazlı borç, tahsilat, vade ve gecikme
- `customerLedger(id)` — her ödeme ve borç kaydı ayrı hareket
- `kpis()`, `monthlySeries(n)`, `agingBuckets()` — dashboard ve rapor beslemeleri

Ay karşılaştırması (`momChange`), içinde bulunulan ay henüz bitmediği için geçen
ayın **aynı gün aralığıyla** kıyaslanır.

## Kendi verinize bağlama

`js/data.js` içindeki `PRODUCTS`, `CUSTOMERS`, `STAFF`, `SALES`, `PAYMENTS`,
`PURCHASES` dizilerini kendi kaynağınızdan doldurun. Türetilmiş fonksiyonlar ve
tüm arayüz aynı kalır — sayfa şablonları yalnızca bu fonksiyonları çağırır.

## Responsive davranış

- **≥1025px** — sabit kenar çubuğu, 3 sütunlu KPI ızgarası
- **≤1024px** — kenar çubuğu hamburger çekmeceye döner (örtü + Esc ile kapanır)
- **≤860px** — iki sütunlu ızgaralar tek sütuna iner
- **≤720px** — KPI kartları alt alta; tablolar `data-label` ile **kart görünümüne**
  dönüşür; geniş tablolar yatayda kaydırılır; filtre şeridi tek satırda kayar;
  fatura kâğıdı tek sütuna iner

13 sayfanın tamamı **3 dil × 4 ekran genişliği** (1440 / 820 / 390 / 360 px)
kombinasyonunda yatay taşma, JS hatası ve çevrilmemiş metin olmadan
doğrulanmıştır.
