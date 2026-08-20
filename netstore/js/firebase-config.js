/* ==========================================================================
   NetStore — ortak kullanım ayarları

   BURASI DOLDURULMADAN uygulama eskisi gibi çalışır: veriler yalnızca
   telefonun kendi içinde durur, giriş ekranı çıkmaz. Aşağıdaki iki alan
   doldurulduğu anda uygulama ortak moda geçer:

     1. FIREBASE  — Firebase konsolundan alınan proje bilgileri
     2. ALLOWED   — uygulamayı kullanacak Google hesaplarının e-postaları

   Adım adım kurulum için: netstore/README.md > “Ortak kullanım (iki kişi)”

   Not: buradaki apiKey gizli bir anahtar DEĞİLDİR; her web uygulamasında
   açıkta durur. Güvenlik, Firestore kurallarıyla sağlanır — yalnızca
   aşağıdaki e-postalar veriye erişebilir (bkz. firestore.rules).
   ========================================================================== */

const FIREBASE = {
  apiKey:            '',
  authDomain:        '',
  projectId:         '',
  storageBucket:     '',
  messagingSenderId: '',
  appId:             ''
};

/* Uygulamayı kullanacak Google hesapları. Küçük harfle yazın.
   Örnek: ['ferhat@gmail.com', 'ortagim@gmail.com'] */
const ALLOWED = [];

/* Ortak defterin adı. İki kişi de aynı defteri görsün diye aynı kalmalı. */
const SHOP_ID = 'main';

/** Firebase bilgileri girilmiş mi? Girilmediyse uygulama yerel modda açılır. */
function cloudConfigured() {
  return !!(FIREBASE.apiKey && FIREBASE.projectId && FIREBASE.appId);
}
