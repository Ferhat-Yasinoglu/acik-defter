# NetStore — Stok, Satış, Müşteri, Borç & Tahsilat Paneli

Modern dark SaaS dashboard estetiğinde, bağımlılıksız (vanilla HTML/CSS/JS) bir
yönetim paneli arayüzü. Derleme adımı yok — `netstore/index.html` doğrudan
tarayıcıda açılır.

**Üç dil:** دری (Farsça) · Türkçe · English. Seçilen dil arayüzün tamamını,
faturaları ve tahsilat fişlerini kapsar; Farsça seçildiğinde düzen sağdan sola
döner, rakamlar Fars rakamlarına (۰۱۲۳) geçer.

**Para birimi:** Afgani — Farsça `افغانی`, Türkçe/İngilizce `AFN`.

**Kayıtlar kalıcıdır:** girdiğiniz her şey tarayıcıda saklanır, sayfa yenilense de
durur. İlk açılışta örnek veri yüklü gelir; Ayarlar → Veri bölümünden **Sıfırdan
Başla** ile temizleyip kendi kayıtlarınızla çalışabilirsiniz.

> **Not:** Bu, mevcut bir uygulamanın yeniden tasarımı değil, sıfırdan kurulmuş
> bir arayüz katmanıdır. Örnek veri seti `js/data.js` içindedir; kendi veri
> kaynağınıza bağlarken yalnızca o dosyayı değiştirmeniz yeterlidir.
>
> Kayıt formları çalışır durumdadır ancak **oturum belleğinde** tutulur: sayfa
> yenilenince örnek veri seti yeniden üretilir. Kalıcılık, gerçek bir arka uca
> bağlanınca eklenecek.

## Dosya yapısı

| Dosya | Sorumluluk |
|---|---|
| `index.html` | Uygulama kabuğu: kenar çubuğu, üst bar, belge/modal/bildirim yuvaları |
| `css/netstore.css` | Tasarım sistemi: tokenlar, bileşenler, RTL, responsive, baskı |
| `js/i18n.js` | **Sözlük + dil çalışma zamanı**: çeviri, yön, sayı/para/tarih biçimi |
| `js/pwa.js` | Telefona kurulum: `beforeinstallprompt` yakalama, kurulum/çevrimdışı durumu |
| `js/store.js` | **Kalıcılık**: yerel modda localStorage, ortak modda bulut; yedek al/geri yükle |
| `js/firebase-config.js` | **Doldurulacak dosya**: Firebase bilgileri + izinli e-postalar |
| `js/cloud.js` | Ortak defter: Firestore eşitlemesi, fark bulup yazma, oturum durumu |
| `js/auth.js` | Google giriş ekranı (giriş yok / yetkisiz / yükleniyor) |
| `vendor/firebase.js` | Firebase SDK'nın yerel kopyası (npm'den paketlendi) |
| `firestore.rules` | Sunucu kurallarının şablonu; gerçek liste Firebase konsolunda durur |
| `js/search.js` | Global arama: ürün, müşteri ve fatura kayıtlarında |
| `js/icons.js` | Satır içi SVG ikon seti (CDN bağımlılığı yok, çevrimdışı çalışır) |
| `js/data.js` | Örnek veri + **tüm türetilmiş hesaplar** (KPI, durum, bakiye, seriler) |
| `js/charts.js` | SVG grafik motoru: sparkline, çizgi/alan, yığılmış çubuk, yatay çubuk |
| `js/invoice.js` | Fatura ve tahsilat fişi belgeleri (seçili dilde, basılabilir) |
| `js/forms.js` | Kayıt formları, doğrulama, silme onayı, CSV dışa aktarma |
| `js/app.js` | Yönlendirme (hash router), sayfa şablonları, etkileşimler |
| `sw.js` | Servis çalışanı: uygulama kabuğunu önbelleğe alır, internetsiz açar |
| `manifest.webmanifest` | Uygulama künyesi: ad, simgeler, tam ekran modu, kısayollar |
| `css/fonts.css` + `fonts/` | Inter ve Vazirmatn'ın yerel kopyası (209 KB, 4 dosya) |
| `icons/` | Marka amblemi: ana ekran simgeleri (192/512/1024), maskable, favicon, arayüz kopyası |

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
| Tarih | Her dilde **GG/AA/YYYY** (tr'de `GG.AA.YYYY`) |
| Takvim | Miladi veya **hicri-şemsi** — Ayarlar'dan seçilir |
| Grafikler | Zaman ekseni RTL'de de soldan sağa akar (`.chart-wrap.ltr`) |
| Telefon/vergi no | `ltr()` ile yön yalıtımı — RTL'de sırası bozulmaz |

Dil `localStorage` içinde `netstore-lang` anahtarıyla saklanır; ilk açılışta
tarayıcı diline göre seçilir. Değiştirmek için üst bardaki `فا / TR / EN` düğmeleri
veya Ayarlar sayfası.

**Takvim.** Ayarlar sayfasından miladi ile hicri-şemsi arasında geçiş yapılır;
seçim `netstore-cal` anahtarıyla saklanır ve tüm ekranları, faturaları ve
fişleri kapsar. Hicri-şemsi seçildiğinde grafik kovaları da şemsi aylara göre
gruplanır — `fa-AF` yerel ayarı Afganistan ay adlarını verir (حمل، ثور، جوزا،
سرطان، اسد…), İran'ınkileri değil.

**Not — tarih sırası:** ICU'nun `fa-AF` kalıbı miladi tarihi `AA/GG/YYYY`
üretiyor ve bu Afganistan'da yanlış okunuyor; bu yüzden sıra `i18n.js` içindeki
`fmtDate` fonksiyonunda `formatToParts` ile elle kurulur.

## Kayıt işlemleri

Tüm formlar veri katmanına bağlıdır; kaydettiğinizde bağımlı alanlar da güncellenir.

| İşlem | Yan etki |
|---|---|
| **Yeni satış** | Çok kalemli; stoktan düşer, peşin tahsilat işlenir, durum hesaplanır |
| **Yeni alış** | Çok kalemli; stoğa ekler, tedarikçi bakiyesi oluşur |
| **Stok girişi** | Seçili ürünün mevcut stoğuna ekler |
| **Ürün ekle / düzenle / sil** | Stok kodu benzersizliği denetlenir |
| **Müşteri ekle / düzenle / sil** | Silmede faturaları ve tahsilatları da kaldırır |
| **Personel ekle / düzenle** | Aktif/pasif durumu KPI'ları etkiler |
| **Tahsilat ekle** | Fatura ve müşteri bakiyesinden düşer |
| **Dışa aktar** | Bulunulan sayfaya göre CSV üretir (UTF-8 BOM'lu, Excel uyumlu) |

Doğrulamalar: zorunlu alan, sayı biçimi, sıfırdan büyük olma, yinelenen stok
kodu, yetersiz stok, peşin tahsilatın toplamı aşması. Zararına satış engellenmez
ama uyarı verilir. Silme işlemleri onay ister; borçlu müşteri silinirken açık
bakiye tutarı gösterilir.

Kalem listesi ortak bir ızgara üzerinde kurulur (`display: contents`), böylece
miktar ve tutar sütunları satırlar arasında hizalı kalır.

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

## Veri ve kalıcılık

Her kayıt değişikliğinden sonra otomatik yazılır (`commit()` → `saveData()` +
`render()`). `saveData()` iki moddan hangisinde olduğuna kendisi karar verir:
**yerel modda** `localStorage`'a (`netstore-data` anahtarı), **ortak modda**
Firestore'a (bkz. “Ortak kullanım”).

| İşlem | Nerede | Ne yapar |
|---|---|---|
| **Yedek Al** | Ayarlar → Veri | Tüm kayıtları JSON dosyası olarak indirir |
| **Yedeği Geri Yükle** | Ayarlar → Veri | JSON dosyasını doğrular ve içeri alır |
| **Sıfırdan Başla** | Ayarlar → Veri | Tüm kayıtları siler; kendi verinizle başlarsınız |
| **Verileri Sıfırla** | Ayarlar → Tehlikeli Bölge | Örnek veri setine döner |

Uygulama boş veriyle de çalışır: sayfalar yönlendirici boş durum mesajı gösterir,
ürün/müşteri/personel olmadan satış formu açılmaz ve nedenini söyler.

Uygulamanın geri kalanı hangi modda olduğunu bilmez: form kodu diziyi
değiştirip `commit()` çağırır, gerisi `js/store.js` ile `js/cloud.js`'in işidir.

## Global arama

Üst bardaki kutu ürün adı, stok kodu, kategori, müşteri adı, telefon, e-posta,
adres ve fatura numarasında arar. Sonuçlar gruplanır; `↑ ↓` ile gezilir, `Enter`
ile açılır, `Esc` ile kapanır. Türkçe büyük-küçük harf farkı ve Fars/Arap
rakamları normalize edilir (`۱۲۳` yazınca `123` bulunur).

Dar ekranda kutu yer kaplamasın diye büyüteç düğmesiyle açılır.

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

Uygulamayı açıp Ayarlar → Veri → **Sıfırdan Başla** deyin; örnek veri silinir,
kendi kayıtlarınızı girmeye başlarsınız. Ortak modda bu işlem buluttaki defteri
de boşaltır.

Toplu aktarım için `js/data.js` içindeki `PRODUCTS`, `CUSTOMERS`, `STAFF`,
`SALES`, `PAYMENTS`, `PURCHASES` dizilerini kendi kaynağınızdan doldurun.
Türetilmiş fonksiyonlar ve tüm arayüz aynı kalır — sayfa şablonları yalnızca
bu fonksiyonları çağırır.

## Ortak kullanım (iki kişi) — Google ile giriş

Varsayılan hâlde uygulama **yerel** çalışır: kayıtlar açıldığı cihazda durur.
`js/firebase-config.js` doldurulduğu anda **ortak moda** geçer — iki kişi
Google hesabıyla girer, ikisi de aynı defteri görür, biri kayıt girdiğinde
diğerinin ekranında **anında** belirir.

### Neden kayıt başına ayrı belge?

Tüm veriyi tek belgede tutmak daha basit olurdu, ama iki kişi aynı anda kayıt
girdiğinde biri diğerinin yazdığını silerdi. Her kaydın kendi belgesi olunca
çakışma yalnızca ikisi **aynı kaydı aynı anda** düzenlerse olur.

Aynı sebeple kayıt kimlikleri de değişti: sıra numarası (`p1`, `p2`, …) yerine
zaman + rastgele son ek kullanılıyor. İki kişi aynı saniyede satış girse bile
aynı kimliği üretemezler. Belge numaraları (`FT-…`) o ayın en büyük
numarasından devam ediyor — dizi uzunluğundan saymak, kayıt silinince numarayı
tekrarlardı.

### Kurulum (yaklaşık 10 dakika, bir kez)

**1. Proje aç** — [console.firebase.google.com](https://console.firebase.google.com)
→ *Add project* → ad verin → Google Analytics'e gerek yok, kapatın.

**2. Web uygulaması ekle** — proje ana sayfasında `</>` simgesi → bir takma ad
yazın → *Register app*. Ekranda çıkan `firebaseConfig` bloğundaki değerleri
`js/firebase-config.js` içine kopyalayın.

**3. Google girişini aç** — sol menüde *Build → Authentication → Get started*
→ *Sign-in method* sekmesi → **Google** → *Enable* → destek e-postasını seçin
→ *Save*.

**4. Alan adını izin listesine ekle** — *Authentication → Settings →
Authorized domains* → *Add domain* → uygulamanın adresi
(örn. `ferhat-yasinoglu.github.io`). Bu yapılmazsa giriş `unauthorized-domain`
hatası verir.

**5. Veritabanını aç** — *Build → Firestore Database → Create database* →
**Production mode** → konum olarak `asia-south1` (Mumbai) Afganistan'a en
yakınıdır → *Enable*.

**6. Güvenlik kurallarını yapıştır** — *Firestore Database → Rules* sekmesi →
`firestore.rules` dosyasının içeriğini yapıştırın, **e-posta listesini kendi
hesaplarınızla değiştirin** → *Publish*.

**7. (İsteğe bağlı) App Check'i açın** — *App Check → Apps → web
uygulamasını seç → reCAPTCHA v3*. Konsolun verdiği **site key**'i
`js/firebase-config.js` içindeki `RECAPTCHA_SITE_KEY` alanına yazın.
Konsolda **Enforce**'u ancak anahtar girildikten ve uygulamanın çalıştığı
görüldükten sonra açın — sırası ters olursa erişim kesilir.

### Kim girebilir listesi yalnızca sunucuda

İzinli hesaplar **sadece** Firestore kurallarında tutulur; uygulama kodunda
böyle bir liste yoktur. Yetkisiz bir hesapla girildiğinde Firestore
`permission-denied` döner ve uygulama “bu hesabın erişimi yok” ekranını
gösterir.

| Nerede | Ne işe yarar |
|---|---|
| Firebase konsolu → Firestore → Rules | **Tek ve gerçek liste.** Buradaki karar bağlayıcıdır. |
| `netstore/firestore.rules` | Yalnızca şablon. Depo herkese açık olduğu için gerçek adresler yazılmaz. |

Hesap eklemek veya çıkarmak için konsoldaki Rules metnini düzenleyip
*Publish* demek yeterlidir; uygulamada değişiklik gerekmez.

`js/firebase-config.js` içindeki `apiKey` **gizli bir anahtar değildir** — her
web uygulamasında açıkta durur, Google da böyle tasarlamıştır. Güvenliği
sağlayan tek şey 6. adımdaki kurallardır; o adımı atlamayın.

### Çevrimdışı ve çakışma

Firestore'un kendi yerel önbelleği açık: internet gidince uygulama çalışmaya
devam eder, girdiğiniz kayıtlar sıraya alınır, bağlantı gelince kendiliğinden
eşitlenir. İkiniz de **aynı anda çevrimdışıyken** satış girerseniz iki fatura
aynı numarayı alabilir; kayıtlar kaybolmaz, yalnızca numara tekrar eder.

### Ücret

İki kullanıcı ve küçük bir dükkan için Firebase'in ücretsiz katmanı
(*Spark*) fazlasıyla yeterlidir: günde 50.000 okuma / 20.000 yazma ve 1 GB
depolama. Kart bilgisi istemez.

### Firebase paketini yeniden üretmek

`vendor/firebase.js`, SDK'nın yalnızca kullanılan parçalarından oluşan yerel
bir kopyadır (CDN yerine depoda tutuluyor ki uygulama internetsiz de
yüklenebilsin):

```
npm install firebase@10 esbuild
esbuild entry.js --bundle --format=iife --minify --target=es2019 \
  --outfile=vendor/firebase.js
```

Dosyalarda değişiklik yaptıktan sonra `sw.js` içindeki `CACHE` sürümünü
artırmayı unutmayın; yoksa telefonlarda eski kopya açılmaya devam eder.

## Telefona kurulum (Android / iPhone)

Uygulama bir **PWA**'dır: ayrı bir mağaza kurulumu olmadan ana ekrana eklenir,
tam ekran açılır ve **internetsiz çalışır**.

| Parça | Ne yapar |
|---|---|
| `manifest.webmanifest` | Ad, simge, `standalone` modu, `#0B1120` tema rengi, üç kısayol (Yeni Satış / Müşteriler / Borç Takibi) |
| `sw.js` | 23 dosyalık uygulama kabuğunu kurulumda önbelleğe alır; sonraki açılışlarda önce önbellekten verir, arka planda tazeler |
| `js/pwa.js` | Kurulum olayını yakalar; Ayarlar → **Uygulama** kartında “Telefona Kur” düğmesi olarak sunar |
| `fonts/` | Yazı tipleri depoda — internetsiz açılışta Farsça metin yedek yazı tipine düşmez |

Amblem tek kaynaktan üretilir: `icons/logo-128.png` arayüzde (kenar çubuğu,
giriş ekranı, fatura başlığı), `favicon-64.png` sekmede, `icon-*.png` ana
ekranda kullanılır. `maskable-512.png` Android'in simgeyi kırpmasına karşı
koyu lacivert zemine oturtulmuş ve amblem güvenli alanda tutulmuştur.

**Kurulum:** Android · Chrome'da ⋮ → *Uygulamayı yükle*, iPhone · Safari'de
Paylaş → *Ana Ekrana Ekle*. Chrome kurulabilir olduğuna karar verdiğinde
Ayarlar sayfasındaki düğme kendiliğinden belirir.

**Şart:** servis çalışanı yalnızca **https://** (veya `localhost`) üzerinde
çalışır. Dosyadan (`file://`) açıldığında uygulama yine çalışır, sadece
çevrimdışı katmanı devre dışı kalır.

Ana ekrandan açıldığında `@media (display-mode: standalone)` bloğu devreye
girer: çentik ve alt gezinme çubuğu payı (`env(safe-area-inset-*)`) uygulamanın
kendisi tarafından bırakılır.

**Dosyalarda değişiklik yaptıktan sonra** `sw.js` içindeki `CACHE` sürümünü
artırın (`netstore-v1` → `netstore-v2`); eski önbellek silinir ve yeni sürüm
telefona iner.

## Responsive davranış

- **≥1025px** — sabit kenar çubuğu, 3 sütunlu KPI ızgarası
- **≤1024px** — kenar çubuğu hamburger çekmeceye döner (örtü + Esc ile kapanır)
- **≤860px** — iki sütunlu ızgaralar tek sütuna iner
- **≤720px** — KPI kartları alt alta; tablolar `data-label` ile **kart görünümüne**
  dönüşür; geniş tablolar yatayda kaydırılır; filtre şeridi tek satırda kayar;
  fatura kâğıdı tek sütuna iner

13 sayfanın tamamı **3 dil × 4 ekran genişliği** (1440 / 820 / 390 / 360 px)
kombinasyonunda yatay taşma, JS hatası ve çevrilmemiş metin olmadan
doğrulanmıştır. Ayrıca kalıcılık, arama, yedekleme ve boş-veri davranışı için
**21 uçtan uca kontrol**, form işlemleri için **31 kontrol** ve mobil arama için
**15 kontrol**, telefona kurulum / çevrimdışı davranış için **21 kontrol** ve
ortak defter için **19 kontrol** çalışır durumdadır. Ortak defter testleri iki
istemciyi aynı anda açıp Firebase'i simüle eder: giriş kapısı, izinsiz hesabın
reddi, bir taraftaki kaydın diğerinde belirmesi, stok düşümünün iki tarafta da
tutması, silmenin yayılması, kimliklerin çakışmaması ve çıkışta belleğin
boşalması.

Kayıt işlemleri ayrıca uçtan uca test edilmiştir (31 kontrol): satış oluşturma
ve stok düşümü, yetersiz stokta engelleme, ürün ekle/düzenle/sil, yinelenen stok
kodu reddi, stok girişi, müşteri ekleme ve bağlı kayıtlarla silme, alışta
maliyet fiyatı ve stok artışı, personel işlemleri, CSV indirme, hicri-şemsi
takvimin ekran–grafik–fatura genelinde uygulanması.
