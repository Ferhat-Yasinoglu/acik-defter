# NetStore — Android uygulaması

## Neden TWA, neden Capacitor değil

Denenen ve **çalışmayan** yol: uygulamayı Capacitor/Cordova ile bir WebView
içine koymak. Google, gömülü WebView'lerden gelen OAuth isteklerini
`disallowed_useragent` hatasıyla reddeder — yani uygulama açılır ama
**giriş yapılamaz**. Aynı sorun Electron için de geçerlidir.

Kullanılan yol: **Trusted Web Activity**. Ana ekrandaki simge gerçek bir
Android uygulamasıdır, ama sayfayı telefonda kurulu Chrome motoru çizer.
Google girişi normal tarayıcıdaki gibi çalışır, adres çubuğu görünmez.

## Kurulum adımları (bir kereliktir)

1. **İmza anahtarı üret** — kendi bilgisayarında:

   ```
   keytool -genkeypair -v -keystore netstore.keystore \
     -alias netstore -keyalg RSA -keysize 2048 -validity 10000
   ```

   Bu dosyayı ve parolalarını kaybetme. Kaybedersen uygulamayı
   güncelleyemezsin, kullanıcıların önce silip yeniden kurması gerekir.
   Depoya **koyma**.

2. **GitHub gizli anahtarlarını ekle** — Settings → Secrets and variables
   → Actions:

   | Ad | Değer |
   |---|---|
   | `ANDROID_KEYSTORE_B64` | `base64 -w0 netstore.keystore` çıktısı |
   | `ANDROID_KEYSTORE_PASS` | keystore parolası |
   | `ANDROID_KEY_PASS` | alias parolası |

3. **Parmak izini yayınla** — adres çubuğunun görünmemesi için:

   ```
   keytool -list -v -keystore netstore.keystore -alias netstore
   ```

   Çıkan `SHA256:` satırını `assetlinks.json` içine yaz, sonra o dosyayı
   şu adresten yayınla:

   ```
   https://ferhat-yasinoglu.github.io/.well-known/assetlinks.json
   ```

   Dikkat: bu adres **sitenin kökü**, yani `Ferhat-Yasinoglu.github.io`
   adlı ayrı bir depo. `acik-defter` deposu bu adresi karşılamaz. O depo
   yoksa oluştur ve içine `.well-known/assetlinks.json` koy.

   Bu adım atlanırsa uygulama yine kurulur ve çalışır; sadece üstte ince
   bir adres çubuğu görünür.

4. **Çalıştır** — Actions → “Android APK” → Run workflow. Biten APK,
   koşunun altında `NetStore-apk` olarak durur. `v1.0.0` gibi bir etiket
   gönderirsen dosya doğrudan Releases'a düşer ve uygulamanın **İndir**
   sayfasındaki bağlantı çalışmaya başlar.

## Durum

İş akışı yazıldı ama **henüz gerçek bir koşuda denenmedi**. İlk
çalıştırmada Bubblewrap adımının ayar istemesi olasıdır; hata çıktısına
göre `../.github/workflows/android.yml` düzeltilmelidir.

## iOS

Yapılamıyor. Apple, uygulama derlemek için macOS ve yılda 99 $ tutan bir
geliştirici hesabı şart koşar; ayrıca App Store'a bir dükkân panelinin
kabul edilme olasılığı düşüktür. iPhone'da doğru yol Safari → Paylaş →
“Ana Ekrana Ekle”: simge ana ekrana gelir, uygulama tam ekran açılır ve
çevrimdışı çalışır. Uygulamanın **İndir** sayfası bunu anlatıyor.

## Bilgisayar

Ayrı bir kurulum dosyası üretilmiyor — gerek yok. Chrome ya da Edge,
uygulamayı masaüstüne kendi penceresiyle, kendi simgesiyle ve Başlat
menüsü kaydıyla kurar. **İndir** sayfasındaki “Kur” düğmesi bunu başlatır.
Electron ile ayrı bir `.exe` üretmek mümkün olsa da yukarıdaki WebView
sorunu yüzünden Google girişini kırardı.
