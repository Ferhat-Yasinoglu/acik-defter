/* ==========================================================================
   Site davranışı — dil, tema, dil menüsü.

   Tercihler sayfa boyanmadan ÖNCE her sayfanın <head>'indeki küçük script
   tarafından uygulanır. Buradaki kod o kararı değiştirmez, sadece metinleri
   yerine koyar ve düğmeleri bağlar. İkisinin anahtar adları aynı olmalı.
   ========================================================================== */

(function () {
  "use strict";

  var LS_LANG = "ad-lang";
  var LS_THEME = "ad-theme";
  var root = document.documentElement;

  function known(lang) {
    return Object.prototype.hasOwnProperty.call(LANG_META, lang);
  }

  /* Dili <head>'deki script çoktan seçti; tek doğru kaynak <html lang>.
     Satır içi script engellenmişse aynı sırayla yeniden karar veriyoruz. */
  function currentLang() {
    var fromRoot = root.getAttribute("lang");
    if (fromRoot && known(fromRoot)) return fromRoot;
    var stored = localStorage.getItem(LS_LANG);
    if (stored && known(stored)) return stored;
    var browser = (navigator.language || "tr").slice(0, 2).toLowerCase();
    return known(browser) ? browser : "tr";
  }

  /* ------------------------------------------------------------------ dil */

  function applyLanguage(lang, persist) {
    var dict = translations[lang];
    if (!dict) return;

    root.setAttribute("lang", lang);
    root.setAttribute("dir", LANG_META[lang].dir);
    if (persist) {
      try { localStorage.setItem(LS_LANG, lang); } catch (e) { /* özel mod */ }
    }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v !== undefined) el.textContent = v;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-aria-label")];
      if (v !== undefined) el.setAttribute("aria-label", v);
    });

    var page = document.body.getAttribute("data-page");
    if (page && dict["title_" + page]) document.title = dict["title_" + page];

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-current", String(btn.getAttribute("data-lang") === lang));
    });

    document.dispatchEvent(new CustomEvent("site:lang", { detail: { lang: lang, dict: dict } }));
  }

  /* Dil seçici dört düğmeden ibaret: açılır menü yok, dolayısıyla dışarı
     tıklama, Escape ve dar ekranda taşma sorunları da yok. */
  function initLangPicker() {
    document.querySelectorAll(".langs [data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang"), true);
        /* Bağlantı metinleri değişti, genişlikleri de: etkin sekme yine
           görünsün. */
        revealCurrentNavItem();
      });
    });
  }

  /* ----------------------------------------------------------------- tema */

  function resolvedTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(LS_THEME, theme); } catch (e) { /* özel mod */ }
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      var moon = btn.querySelector(".i-moon");
      var sun = btn.querySelector(".i-sun");
      if (moon) moon.hidden = theme === "dark";
      if (sun) sun.hidden = theme !== "dark";
    });
  }

  function initTheme() {
    applyTheme(resolvedTheme());

    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(resolvedTheme() === "dark" ? "light" : "dark");
      });
    });

    /* Kullanıcı henüz bir tercih belirtmediyse sistemi izlemeye devam et. */
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!localStorage.getItem(LS_THEME)) {
          root.setAttribute("data-theme", e.matches ? "dark" : "light");
        }
      });
    }
  }

  /* --------------------------------------------------- etkin sekmeyi göster

     Dar ekranda menü tek satırda yatay kayıyor ve hepsi sığmıyor; sondaki
     sayfalardayken etkin bağlantı ekranın dışında başlıyordu, yani "hangi
     sayfadayım" işareti hiç görünmüyordu. Menüyü o bağlantı görünecek kadar
     kaydırıyoruz.

     Süs değil ama zorunlu da değil: JavaScript çalışmazsa menü yine tam,
     kullanıcı elle kaydırıp her sayfaya gidebiliyor. Menü sığıyorsa
     (geniş ekran) kaydıracak bir şey olmadığı için hiçbir şey yapmıyor. */
  function revealCurrentNavItem() {
    var nav = document.querySelector(".nav");
    if (!nav) return;

    var current = nav.querySelector("[aria-current='page']");
    if (!current || nav.scrollWidth <= nav.clientWidth) return;

    var navBox = nav.getBoundingClientRect();
    var itemBox = current.getBoundingClientRect();
    /* Bağlantı kenara yapışmasın diye bir tutam pay. */
    var margin = 12;

    if (itemBox.right > navBox.right - margin) {
      nav.scrollLeft += itemBox.right - navBox.right + margin;
    } else if (itemBox.left < navBox.left + margin) {
      nav.scrollLeft -= navBox.left - itemBox.left + margin;
    }
  }

  /* ---------------------------------------------------------------- açılış */

  function init() {
    applyLanguage(currentLang(), false);
    initLangPicker();
    initTheme();
    revealCurrentNavItem();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
