# NetStore — Stok, Satış, Müşteri, Borç & Tahsilat Paneli

Modern dark SaaS dashboard estetiğinde, bağımlılıksız (vanilla HTML/CSS/JS) bir
yönetim paneli arayüzü. Derleme adımı yok — `netstore/index.html` doğrudan
tarayıcıda açılır.

> **Not:** Bu, mevcut bir uygulamanın yeniden tasarımı değil, sıfırdan kurulmuş
> bir arayüz katmanıdır. Örnek veri seti `js/data.js` içindedir; kendi veri
> kaynağınıza bağlarken yalnızca o dosyayı değiştirmeniz yeterlidir.

## Dosya yapısı

| Dosya | Sorumluluk |
|---|---|
| `index.html` | Uygulama kabuğu: kenar çubuğu, üst bar, modal ve bildirim yuvaları |
| `css/netstore.css` | Tasarım sistemi: tokenlar, bileşenler, responsive kurallar |
| `js/icons.js` | Satır içi SVG ikon seti (CDN bağımlılığı yok, çevrimdışı çalışır) |
| `js/data.js` | Örnek veri + **tüm türetilmiş hesaplar** (KPI, durum, bakiye, seriler) |
| `js/charts.js` | SVG grafik motoru: sparkline, çizgi/alan, yığılmış çubuk, yatay çubuk |
| `js/app.js` | Yönlendirme (hash router), sayfa şablonları, etkileşimler |

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
  dönüşür; geniş tablolar yatayda kaydırılır; filtre şeridi tek satırda kayar

Tüm sayfalar 1440 / 820 / 390 / 360 px genişliklerde yatay taşma olmadan
doğrulanmıştır.
