/* ==========================================================================
   NetStore — giriş ekranı

   Ortak mod açıkken uygulama, Google girişi yapılmadan çizilmez. Giriş
   ekranı #authHost içinde tam sayfa açılır; uygulamanın geri kalanı
   arkasında durur ama görünmez.

   Üç durum vardır:
     signed-out  — Google düğmesi
     denied      — hesap izin listesinde değil
     loading     — giriş tamam, defter buluttan geliyor
   ========================================================================== */

let AUTH_BUSY = false;

function authHost() { return document.getElementById('authHost'); }

/** Giriş ekranını verilen durumda gösterir. */
function showAuth(state, opts) {
  const host = authHost();
  if (!host) return;
  host.innerHTML = authHTML(state, opts || {});
  host.classList.add('on');
  document.body.classList.add('auth-open');
  hydrateIcons(host);
}

function hideAuth() {
  const host = authHost();
  if (!host) return;
  host.classList.remove('on');
  host.innerHTML = '';
  document.body.classList.remove('auth-open');
}

function authHTML(state, o) {
  const brand =
    '<div class="auth-brand">' +
      '<img class="brand-mark" src="icons/logo-128.png" alt="" aria-hidden="true">' +
      '<div><div class="auth-name">' + esc(t('app_name')) + '</div>' +
      '<div class="auth-tag">' + esc(t('app_sub')) + '</div></div>' +
    '</div>';

  if (state === 'loading') {
    return '<div class="auth-card">' + brand +
      '<div class="auth-wait"><span class="spinner" aria-hidden="true"></span>' +
      esc(t(o.signing ? 'au_signing' : 'au_loading')) + '</div></div>';
  }

  if (state === 'denied') {
    return '<div class="auth-card">' + brand +
      '<div class="alert alert-danger">' + icon('shield') +
        '<div><strong>' + esc(t('au_denied_head')) + '</strong>' +
        '<span class="alert-text">' + esc(t('au_denied', { e: o.email || '' })) + '</span></div></div>' +
      '<button class="btn btn-primary auth-btn" data-act="auth-in">' +
        icon('refresh') + esc(t('au_other')) + '</button>' +
      '</div>';
  }

  return '<div class="auth-card">' + brand +
    '<p class="auth-lead">' + esc(t('au_sub')) + '</p>' +
    (o.failed ? '<div class="alert alert-warning">' + icon('alert') +
      '<div><strong>' + esc(t('au_failed')) + '</strong>' +
      /* Firebase'in döndürdüğü kod. Teşhis için şart: telefonda giriş
         neden başarısız oldu, sebebini bilmeden anlaşılmıyor. ltr sınıfı
         kodun RTL'de ters okunmasını engelliyor. */
      (o.code ? '<span class="alert-text ltr">' + esc(o.code) + '</span>' : '') +
      '</div></div>' : '') +
    '<button class="btn btn-primary auth-btn" data-act="auth-in">' +
      googleGlyph() + esc(t('au_google')) + '</button>' +
    '<p class="auth-note">' + esc(t('au_offline_note')) + '</p>' +
    '</div>';
}

/** Google'ın kendi renkli “G” işareti — düğmenin tanınır olması için. */
function googleGlyph() {
  return '<svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true">' +
    '<path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>' +
    '<path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z"/>' +
    '<path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z"/>' +
    '<path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z"/>' +
    '</svg>';
}

/* --------------------------------------------------------------------------
   Eylemler
   -------------------------------------------------------------------------- */

function authSignIn() {
  if (AUTH_BUSY) return;
  AUTH_BUSY = true;
  showAuth('loading', { signing: true });

  cloudSignIn()
    .then(function (res) {
      AUTH_BUSY = false;
      /* null: kullanıcı pencereyi kapattı. Yönlendirmeye düştüysek zaten
         sayfa değişir; her iki durumda da onAuthStateChanged devralır. */
      if (res === null) showAuth('signed-out', {});
    })
    .catch(function () {
      AUTH_BUSY = false;
      showAuth('signed-out', {
        failed: true,
        code: typeof authErrorCode === 'function' ? authErrorCode() : ''
      });
    });
}

function authSignOut() {
  cloudSignOut().catch(function () {});
}
