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
  apiKey:            'AIzaSyBev35PriGcxWn3wae23HWr79FN5HJ83fw',
  authDomain:        'netstore-62221.firebaseapp.com',
  projectId:         'netstore-62221',
  storageBucket:     'netstore-62221.firebasestorage.app',
  messagingSenderId: '1004942071993',
  appId:             '1:1004942071993:web:4debe0a294620b130fa368'
};

/* Uygulamayı kullanacak Google hesapları. Büyük/küçük harf önemli değil —
   karşılaştırma iki tarafı da küçük harfe çevirerek yapılır (cloud.js). */
const ALLOWED = [
  'farhadyaqoobi.kunduz@gmail.com',
  'muhammedyakubi2000@gmail.com'
];

/* Ortak defterin adı. İki kişi de aynı defteri görsün diye aynı kalmalı. */
const SHOP_ID = 'main';

/** Firebase bilgileri girilmiş mi? Girilmediyse uygulama yerel modda açılır. */
function cloudConfigured() {
  return !!(FIREBASE.apiKey && FIREBASE.projectId && FIREBASE.appId);
}
