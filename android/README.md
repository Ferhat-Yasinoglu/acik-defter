# NetStore — Android uygulaması

## Ne yapılıyor

Uygulama **Trusted Web Activity** olarak paketleniyor. Ana ekrandaki simge
gerçek bir Android uygulaması; sayfayı telefonda kurulu Chrome motoru
çiziyor. Adres çubuğu görünmüyor, uygulama kendi penceresinde açılıyor.

### Neden WebView değil

Denenmeyen yol: Capacitor/Cordova ile uygulamayı bir WebView içine koymak.
Google, gömülü WebView'lerden gelen OAuth isteklerini `disallowed_useragent`
hatasıyla reddeder — uygulama açılır ama **giriş yapılamaz.** Aynı sorun
Electron için de geçerli, masaüstünde ayrı bir `.exe` üretilmemesinin sebebi
de bu.

### Neden Bubblewrap değil

Bubblewrap CLI etkileşimli soruları yüzünden CI'da öngörülebilir
davranmıyordu. Gradle projesi bunun yerine elle yazıldı — sekiz küçük dosya,
hepsi bu klasörde, ne ürettiği görünüyor.

Hiç Java/Kotlin kaynağı yok: `LauncherActivity` ve `DelegationService`
doğrudan `androidbrowserhelper` kitaplığından geliyor, `AndroidManifest.xml`
içinde tanımlanıyorlar.

## Yapı

```
android/
  settings.gradle          modüller ve depolar
  build.gradle             Android Gradle eklentisi 8.5.2
  gradle.properties
  assetlinks.json          site doğrulaması için şablon
  app/
    build.gradle           imza bilgileri ortam değişkenlerinden okunur
    src/main/AndroidManifest.xml
    src/main/res/values/    strings · colors · styles
    src/main/res/mipmap-*/  simgeler (klasik + uyarlanabilir, 5 yoğunluk)
    src/main/res/drawable-*/splash.png
```

Simgeler `netstore/icons/icon-512.png` amblemi ölçeklenerek üretildi.

## Derleme

**Actions → Android APK → Run workflow.** Hazırlık gerekmez: gizli imza
anahtarı tanımlı değilse iş akışı kendisi bir tane üretir.

Biten dosya koşunun altında iki parça hâlinde durur:

| Dosya | Ne işe yarar |
|---|---|
| `NetStore-apk` | kurulacak `.apk` |
| `imza-anahtari` | üretilen anahtar ve parolası (yalnızca anahtar üretildiyse) |

### İmzayı kalıcı yapmak

Her koşu yeni bir anahtar üretirse imza da değişir; imzası değişen bir
uygulama **güncellenemez**, önce silinip yeniden kurulması gerekir. Bunu bir
kez çözmek için `imza-anahtari` dosyasını indir ve içindekileri gizli anahtar
olarak ekle:

Settings → Secrets and variables → Actions

| Ad | Değer |
|---|---|
| `ANDROID_KEYSTORE_B64` | `keystore.base64.txt` içeriği |
| `ANDROID_KEYSTORE_PASS` | `parola.txt` içeriği |
| `ANDROID_KEY_PASS` | aynı parola |

Bundan sonraki bütün derlemeler aynı imzayı kullanır. Anahtarı kaybedersen
uygulamayı bir daha güncelleyemezsin.

### Sürüm yayınlamak

```
git tag v1.0.0
git push origin v1.0.0
```

Etiket gönderildiğinde APK doğrudan **Releases**'a düşer ve uygulamanın
**İndir** sayfasındaki Android bağlantısı çalışmaya başlar.

## Adres çubuğunu gizlemek

APK kurulduğunda çalışır, ama site doğrulanmadıysa üstte ince bir adres
çubuğu görünür. Gizlemek için:

1. Derleme özetindeki `SHA-256` parmak izini kopyala
2. `assetlinks.json` içindeki yer tutucunun yerine yaz
3. Dosyayı şu adresten yayınla:

   ```
   https://ferhat-yasinoglu.github.io/.well-known/assetlinks.json
   ```

Dikkat: bu adres **sitenin kökü**, yani `acik-defter` deposu değil.
`Ferhat-Yasinoglu.github.io` adında ayrı bir depo açıp içine
`.well-known/assetlinks.json` koyman gerekiyor.

## iOS

Yapılamıyor. Apple derleme için macOS ve yılda 99 $ tutan bir geliştirici
hesabı şart koşuyor. iPhone'da doğru yol Safari → Paylaş → **Ana Ekrana
Ekle**: simge ana ekrana gelir, uygulama tam ekran açılır, çevrimdışı
çalışır.

## Bilgisayar

Ayrı kurulum dosyası üretilmiyor. Chrome ya da Edge uygulamayı masaüstüne
kendi penceresi, kendi simgesi ve Başlat menüsü kaydıyla kurar; uygulamanın
**İndir** sayfasındaki “Kur” düğmesi bunu başlatır. Electron ile `.exe`
üretmek mümkün ama yukarıdaki WebView sorunu yüzünden Google girişini
kırardı.
