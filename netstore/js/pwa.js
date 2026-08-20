/* ==========================================================================
   NetStore — telefona kurulum (PWA)

   Chrome, uygulamanın kurulabilir olduğuna karar verdiğinde
   `beforeinstallprompt` olayını gönderir. Tarayıcının kendi çubuğunu
   beklemek yerine olayı yakalayıp saklıyoruz; kullanıcı Ayarlar'daki
   düğmeye bastığında kurulumu biz başlatıyoruz.

   Bu dosya i18n dışında hiçbir şeye bağlı değildir ve app.js'ten önce
   yüklenir — olay, uygulama çizilmeden önce de gelebilir.
   ========================================================================== */

/* Yakalanan kurulum olayı. Yalnızca bir kez kullanılabilir. */
let INSTALL_EVENT = null;
let INSTALL_DONE = false;

window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  INSTALL_EVENT = e;
  refreshSettingsIfOpen();
});

window.addEventListener('appinstalled', function () {
  INSTALL_DONE = true;
  INSTALL_EVENT = null;
  if (typeof toast === 'function') toast(t('pw_install_done'), 'success');
  refreshSettingsIfOpen();
});

/** Ayarlar sayfası açıksa kurulum kartını tazele. */
function refreshSettingsIfOpen() {
  if (typeof render === 'function' && typeof STATE === 'object' && STATE.route === 'ayarlar') render();
}

/** Uygulama ana ekrandan mı açıldı? */
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true;
}

/**
 * Kurulum durumu:
 *   'installed' — zaten kurulu ya da ana ekrandan açılmış
 *   'ready'     — düğmeye basınca kurulabilir
 *   'manual'    — tarayıcı menüsünden kurulacak (iOS, Firefox vb.)
 */
function installState() {
  if (INSTALL_DONE || isStandalone()) return 'installed';
  return INSTALL_EVENT ? 'ready' : 'manual';
}

/** Kurulum penceresini aç. Kullanıcı hareketi içinde çağrılmalıdır. */
function promptInstall() {
  if (!INSTALL_EVENT) return;
  const ev = INSTALL_EVENT;
  INSTALL_EVENT = null;               /* olay tekrar kullanılamaz */
  ev.prompt();
  ev.userChoice.then(function (res) {
    if (res && res.outcome === 'accepted') {
      INSTALL_DONE = true;
    } else {
      if (typeof toast === 'function') toast(t('pw_install_no'), 'info');
    }
    refreshSettingsIfOpen();
  }).catch(function () { refreshSettingsIfOpen(); });
}

/**
 * Çevrimdışı hazırlık durumu:
 *   'on'   — servis çalışanı devrede, dosyalar önbellekte
 *   'wait' — kayıtlı ama bu sekmeyi henüz devralmadı
 *   'none' — file:// veya desteklenmeyen tarayıcı
 */
function offlineState() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return 'none';
  return navigator.serviceWorker.controller ? 'on' : 'wait';
}
