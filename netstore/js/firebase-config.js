/* ==========================================================================
   NetStore — ortak kullanım ayarları

   BURASI DOLDURULMADAN uygulama eskisi gibi çalışır: veriler yalnızca
   telefonun kendi içinde durur, giriş ekranı çıkmaz. FIREBASE bloğu
   doldurulduğu anda uygulama ortak moda geçer.

   Adım adım kurulum için: netstore/README.md > “Ortak kullanım (iki kişi)”

   Not: buradaki apiKey gizli bir anahtar DEĞİLDİR; her web uygulamasında
   açıkta durur. Kim girebilir sorusunun cevabı burada değil, Firebase
   konsolundaki Firestore kurallarındadır (bkz. firestore.rules).
   ========================================================================== */

const FIREBASE = {
  apiKey:            'AIzaSyBev35PriGcxWn3wae23HWr79FN5HJ83fw',
  authDomain:        'netstore-62221.firebaseapp.com',
  projectId:         'netstore-62221',
  storageBucket:     'netstore-62221.firebasestorage.app',
  messagingSenderId: '1004942071993',
  appId:             '1:1004942071993:web:4debe0a294620b130fa368'
};

/* --------------------------------------------------------------------------
   App Check — kötüye kullanım koruması (isteğe bağlı)

   Doldurulursa Firebase, isteğin gerçekten bu uygulamadan geldiğini
   reCAPTCHA v3 ile doğrular; başka bir yerden kopyalanan apiKey ile
   yapılan istekler daha kapıda kesilir.

   Anahtarı almak için: Firebase konsolu > App Check > Apps > web
   uygulamasını seç > reCAPTCHA v3 > kaydet. Konsolun verdiği SITE KEY
   buraya yazılır (secret key değil — o sunucuda kalır).

   Boş bırakılırsa App Check devre dışıdır ve uygulama normal çalışır.
   ÖNEMLİ: konsolda “Enforce” açmadan önce buranın dolu olduğundan ve
   uygulamanın çalıştığından emin olun; sırası ters olursa erişim kesilir.
   -------------------------------------------------------------------------- */

const RECAPTCHA_SITE_KEY = '6LcSDpItAAAAAGrl2DoyssL10wDSPaWOd_BK6JLQ';

/* --------------------------------------------------------------------------
   Kim girebilir?

   Liste burada DEĞİL, Firestore kurallarında tutulur. İki sebeple:

     1. Güvenlik zaten orada uygulanıyor — buradaki bir kopya yalnızca
        arayüz süsü olurdu ve iki listenin ayrı düşme riski doğardı.
     2. Bu depo herkese açık; izinli hesapları burada duyurmak, saldırgana
        hangi adresleri hedefleyeceğini söylemek olurdu.

   Yetkisiz bir hesapla girildiğinde Firestore “permission-denied” döner ve
   uygulama “bu hesabın erişimi yok” ekranını gösterir (bkz. cloud.js).

   Listeyi değiştirmek için: Firebase konsolu > Firestore Database > Rules.
   -------------------------------------------------------------------------- */

/* Ortak defterin adı. İki kişi de aynı defteri görsün diye aynı kalmalı. */
const SHOP_ID = 'main';

/** Firebase bilgileri girilmiş mi? Girilmediyse uygulama yerel modda açılır. */
function cloudConfigured() {
  return !!(FIREBASE.apiKey && FIREBASE.projectId && FIREBASE.appId);
}
