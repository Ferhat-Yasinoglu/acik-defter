/* ==========================================================================
   NetStore — ortak defter (Firebase)

   İki kişi aynı verileri görsün diye kayıtlar Firestore'da tutulur.
   Uygulamanın geri kalanı bundan habersizdir: form kodu diziyi eskisi gibi
   değiştirir ve commit() çağırır; buradaki katman farkı bulup buluta yazar,
   karşı taraftan gelen değişikliği de diziye uygular.

   Neden kayıt başına belge?
   Tüm veriyi tek belgede tutmak basit olurdu ama iki kişi aynı anda kayıt
   girdiğinde biri diğerinin yazdığını silerdi. Her kaydın kendi belgesi
   olunca çakışma yalnızca aynı kaydı aynı anda düzenlerlerse olur.

   Çevrimdışı: Firestore'un kendi yerel önbelleği açık. İnternet gidince
   uygulama çalışmaya devam eder, bağlantı gelince kendiliğinden eşitler.
   ========================================================================== */

let CLOUD = {
  on: false,        /* ortak mod etkin mi */
  ready: false,     /* ilk veri geldi mi */
  user: null,       /* giriş yapan Google hesabı */
  db: null,
  auth: null,
  unsubs: [],
  error: ''
};

/* Son eşitlenen hâlin parmak izi: koleksiyon -> Map(id -> imza).
   Yazarken yalnızca değişen kayıtları göndermek için kullanılır. */
let SHADOW = {};

/** Ortak mod açılabilir mi? (ayarlar dolu + SDK yüklendi) */
function cloudEnabled() {
  return typeof cloudConfigured === 'function' && cloudConfigured() &&
         typeof FB !== 'undefined';
}

/** Şu an buluta yazıyor muyuz? */
function cloudActive() {
  return CLOUD.on && CLOUD.ready;
}

/* --------------------------------------------------------------------------
   Açılış
   -------------------------------------------------------------------------- */

/**
 * Firebase'i başlatır ve oturum durumunu dinler.
 * @param {object} cb - onSignedOut, onDenied, onReady, onData geri çağrıları
 */
function cloudStart(cb) {
  CLOUD.on = true;
  const app = FB.initializeApp(FIREBASE);

  /* App Check — anahtar girilmişse. Firestore'dan ÖNCE kurulmalı, yoksa
     ilk istekler belirteçsiz gider. Anahtar yoksa sessizce atlanır. */
  if (typeof RECAPTCHA_SITE_KEY === 'string' && RECAPTCHA_SITE_KEY) {
    try {
      FB.initializeAppCheck(app, {
        provider: new FB.ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
    } catch (e) {
      /* Yanlış anahtar uygulamayı kilitlemesin; konsolda Enforce kapalıysa
         istekler yine geçer, açıksa zaten kural katmanı uyarır. */
    }
  }

  CLOUD.auth = FB.getAuth(app);
  CLOUD.db = FB.initializeFirestore(app, {
    /* Çevrimdışı önbellek — birden çok sekme açıkken de tutarlı çalışır. */
    localCache: FB.persistentLocalCache({ tabManager: FB.persistentMultipleTabManager() })
  });

  /* Oturum telefonda kalsın; her açılışta yeniden giriş istenmesin. */
  FB.setPersistence(CLOUD.auth, FB.browserLocalPersistence).catch(function () {});

  /* Açılır pencere engellenmişse yönlendirmeyle giriş yapılmış olabilir. */
  FB.getRedirectResult(CLOUD.auth).catch(function () {});

  FB.onAuthStateChanged(CLOUD.auth, function (user) {
    cloudStop();

    if (!user) { CLOUD.user = null; cb.onSignedOut(); return; }

    /* Bu hesap girebilir mi? Kararı istemci vermez — bağlanmayı deneriz,
       yetkisizse Firestore “permission-denied” döner (bkz. cloudSubscribe).
       Tek doğru liste sunucudaki kurallardır. */
    CLOUD.user = user;
    cloudSubscribe(cb);
  });
}

/**
 * Dinleyicileri kapatır ve belleği boşaltır.
 *
 * Boşaltmak şart: data.js açılışta örnek veriyi üretiyor. Temizlemezsek
 * giriş yapmamış ya da izinsiz bir hesabın açtığı sekmede o veriler
 * bellekte durur — ekranda görünmese bile orada olmamalılar.
 */
function cloudStop() {
  CLOUD.unsubs.forEach(function (u) { try { u(); } catch (e) {} });
  CLOUD.unsubs = [];
  CLOUD.ready = false;
  SHADOW = {};

  const c = collections();
  Object.keys(c).forEach(function (k) { c[k].length = 0; });
}

/* --------------------------------------------------------------------------
   Okuma — buluttan belleğe
   -------------------------------------------------------------------------- */

function colPath(key) {
  return 'shops/' + SHOP_ID + '/' + key;
}

function cloudSubscribe(cb) {
  const keys = Object.keys(collections());
  let firstSeen = 0;
  let closed = false;      /* altı koleksiyon da hata verir; bir kez tepki ver */

  /* Altı koleksiyon da art arda gelir; her biri için ayrı çizim yapmayalım. */
  let pending = null;
  function scheduleRender() {
    if (pending) return;
    pending = setTimeout(function () { pending = null; cb.onData(); }, 0);
  }

  keys.forEach(function (key) {
    const unsub = FB.onSnapshot(
      FB.collection(CLOUD.db, colPath(key)),
      function (snap) {
        applyCloudSnapshot(key, snap);

        if (firstSeen < keys.length) {
          firstSeen++;
          if (firstSeen === keys.length) {
            CLOUD.ready = true;
            CLOUD.error = '';
            cb.onReady();
            return;
          }
          return;                      /* ilk yüklemede tek seferde çizeriz */
        }
        scheduleRender();
      },
      function (err) {
        if (closed) return;
        closed = true;
        CLOUD.error = err && err.code ? err.code : 'unknown';

        /* Kurallar bu hesabı kabul etmiyor: dinleyicileri kapat, belleği
           boşalt ve “erişimin yok” ekranını göster. Yarım gelmiş kayıt
           kalmasın diye cloudStop() şart. */
        if (CLOUD.error === 'permission-denied') {
          const who = CLOUD.user;
          cloudStop();
          CLOUD.user = who;
          cb.onDenied(who || {});
          return;
        }
        cb.onError(CLOUD.error);
      }
    );
    CLOUD.unsubs.push(unsub);
  });
}

/** Gelen belgeleri bellekteki diziye uygular ve imzaları tazeler. */
function applyCloudSnapshot(key, snap) {
  const arr = collections()[key];
  const items = snap.docs.map(function (d) { return decodeRec(key, d.id, d.data()); });

  replaceAll(arr, items);
  if (DATE_FIELDS[key]) arr.sort(function (a, b) { return b.date - a.date; });

  const sig = new Map();
  items.forEach(function (r) { sig.set(r.id, JSON.stringify(r)); });
  SHADOW[key] = sig;
}

/** Firestore Timestamp -> Date; belge kimliği -> kaydın id alanı. */
function decodeRec(key, id, data) {
  const rec = Object.assign({ id: id }, data);
  const fields = DATE_FIELDS[key] || [];
  fields.forEach(function (f) {
    const v = rec[f];
    if (v && typeof v.toDate === 'function') rec[f] = v.toDate();
    else if (typeof v === 'string') rec[f] = new Date(v);
  });
  return rec;
}

/* --------------------------------------------------------------------------
   Yazma — bellekten buluta
   -------------------------------------------------------------------------- */

/**
 * Belleği bulutla eşitler: yalnızca değişen, eklenen ve silinen kayıtlar
 * gönderilir. Firestore yazma isteğini çevrimdışıyken kuyruğa alır.
 */
function cloudSave() {
  if (!cloudActive()) return false;

  const c = collections();
  const batch = FB.writeBatch(CLOUD.db);
  let writes = 0;

  Object.keys(c).forEach(function (key) {
    const prev = SHADOW[key] || new Map();
    const now = new Map();

    c[key].forEach(function (rec) {
      const sig = JSON.stringify(rec);
      now.set(rec.id, sig);
      if (prev.get(rec.id) !== sig) {
        batch.set(FB.doc(CLOUD.db, colPath(key), String(rec.id)), encodeRec(rec));
        writes++;
      }
    });

    prev.forEach(function (_, id) {
      if (!now.has(id)) {
        batch.delete(FB.doc(CLOUD.db, colPath(key), String(id)));
        writes++;
      }
    });

    SHADOW[key] = now;
  });

  if (!writes) return true;

  batch.commit().catch(function (err) {
    CLOUD.error = err && err.code ? err.code : 'write-failed';
    if (typeof toast === 'function') toast(t('cl_write_failed'), 'warning');
  });
  return true;
}

/** id alanı belge kimliğinde zaten var; tanımsız alanlar Firestore'a yazılamaz. */
function encodeRec(rec) {
  const out = {};
  Object.keys(rec).forEach(function (k) {
    if (k === 'id' || rec[k] === undefined) return;
    out[k] = rec[k];
  });
  return out;
}

/* --------------------------------------------------------------------------
   Oturum
   -------------------------------------------------------------------------- */

/** Google ile giriş. Açılır pencere engellenirse yönlendirmeye düşer. */
function cloudSignIn() {
  const provider = new FB.GoogleAuthProvider();
  /* Hesap seçtir: iki kişi aynı telefonu kullanabilir. */
  provider.setCustomParameters({ prompt: 'select_account' });

  return FB.signInWithPopup(CLOUD.auth, provider).catch(function (err) {
    const code = err && err.code ? err.code : '';
    if (/popup-blocked|popup-closed|operation-not-supported|cancelled-popup/.test(code)) {
      if (/popup-closed|cancelled-popup/.test(code)) return null;   /* kullanıcı vazgeçti */
      return FB.signInWithRedirect(CLOUD.auth, provider);
    }
    throw err;
  });
}

function cloudSignOut() {
  cloudStop();
  return FB.signOut(CLOUD.auth);
}

/** Ayarlar sayfasında gösterilen durum bilgisi. */
function cloudInfo() {
  if (!cloudEnabled()) return { mode: 'local' };
  return {
    mode: 'cloud',
    email: CLOUD.user ? CLOUD.user.email : '',
    name: CLOUD.user ? (CLOUD.user.displayName || CLOUD.user.email) : '',
    photo: CLOUD.user ? CLOUD.user.photoURL : '',
    ready: CLOUD.ready,
    error: CLOUD.error,
    guarded: !!(typeof RECAPTCHA_SITE_KEY === 'string' && RECAPTCHA_SITE_KEY)
  };
}
