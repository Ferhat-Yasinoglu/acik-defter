/* ==========================================================================
   Site behaviour — language switching, theme, clock, menus
   ========================================================================== */

(function () {
  const root = document.documentElement;
  const STORAGE_LANG = "fy-lang";
  const STORAGE_THEME = "fy-theme";

  /* ---------------- language ---------------- */

  function getLang() {
    return localStorage.getItem(STORAGE_LANG) || "tr";
  }

  function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    root.setAttribute("lang", lang);
    root.setAttribute("dir", LANG_META[lang].dir);
    localStorage.setItem(STORAGE_LANG, lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });

    document.querySelectorAll(".lang-trigger .name").forEach((el) => {
      el.textContent = lang.toUpperCase();
    });

    document.querySelectorAll(".lang-option").forEach((opt) => {
      opt.classList.toggle("active", opt.getAttribute("data-lang") === lang);
    });

    updateClock();
  }

  function initLangMenu() {
    document.querySelectorAll(".lang-switch").forEach((wrap) => {
      const trigger = wrap.querySelector(".lang-trigger");
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".lang-switch.open").forEach((o) => {
          if (o !== wrap) o.classList.remove("open");
        });
        wrap.classList.toggle("open");
      });

      wrap.querySelectorAll(".lang-option").forEach((opt) => {
        opt.addEventListener("click", () => {
          applyLanguage(opt.getAttribute("data-lang"));
          wrap.classList.remove("open");
        });
      });
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(".lang-switch.open").forEach((o) => o.classList.remove("open"));
    });
  }

  /* ---------------- theme ---------------- */

  function getThemePref() {
    return localStorage.getItem(STORAGE_THEME) || "dark";
  }

  function resolveTheme(pref) {
    if (pref === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return pref;
  }

  function applyTheme(pref) {
    localStorage.setItem(STORAGE_THEME, pref);
    const resolved = resolveTheme(pref);
    root.setAttribute("data-theme", resolved);
    document.querySelectorAll(".theme-toggle .icon-moon").forEach((el) => {
      el.style.display = resolved === "dark" ? "block" : "none";
    });
    document.querySelectorAll(".theme-toggle .icon-sun").forEach((el) => {
      el.style.display = resolved === "dark" ? "none" : "block";
    });
    document.dispatchEvent(new CustomEvent("fy:theme-applied", { detail: { pref, resolved } }));
  }
  window.applyTheme = applyTheme;

  function initTheme() {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyTheme(resolveTheme(getThemePref()) === "dark" ? "light" : "dark");
      });
    });

    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (getThemePref() === "system") applyTheme("system");
      });
    }
  }

  /* ---------------- clock ---------------- */

  function updateClock() {
    const lang = getLang();
    const dict = translations[lang];
    const now = new Date();
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const hh = String(h).padStart(2, "0");
    const period = h >= 6 && h < 18 ? dict.status_day : dict.status_night;

    document.querySelectorAll(".status-pill .label").forEach((el) => {
      el.textContent = `${hh}:${m} ${period}`;
    });
  }

  /* ---------------- mobile menu ---------------- */

  function initMobileMenu() {
    const overlay = document.querySelector(".mobile-overlay");
    if (!overlay) return;

    document.querySelectorAll(".menu-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    document.querySelectorAll(".mobile-close").forEach((btn) => {
      btn.addEventListener("click", closeMobileMenu);
    });

    overlay.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMobileMenu);
    });
  }

  function closeMobileMenu() {
    const overlay = document.querySelector(".mobile-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------- active nav ---------------- */

  function markActiveNav() {
    const page = document.body.getAttribute("data-page");
    document.querySelectorAll("[data-page-link]").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-page-link") === page);
    });
  }

  /* ---------------- init ---------------- */

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getThemePref());
    applyLanguage(getLang());
    initLangMenu();
    initTheme();
    initMobileMenu();
    markActiveNav();

    updateClock();
    setInterval(updateClock, 30000);

    if (window.lucide) lucide.createIcons();
  });
})();
