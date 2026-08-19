/* ==========================================================================
   Appearance panel — theme preference, accent color, glass intensity
   ========================================================================== */

(function () {
  const STORAGE_ACCENT = "fy-accent";
  const STORAGE_GLASS = "fy-glass";
  const STORAGE_THEME = "fy-theme";
  const root = document.documentElement;

  function getAccent() {
    return localStorage.getItem(STORAGE_ACCENT) || "gold";
  }

  function applyAccent(accent) {
    root.setAttribute("data-accent", accent);
    localStorage.setItem(STORAGE_ACCENT, accent);
    document.querySelectorAll(".accent-swatch").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-accent-choice") === accent);
    });
  }

  function getGlass() {
    const v = localStorage.getItem(STORAGE_GLASS);
    return v === null ? 20 : Number(v);
  }

  function applyGlass(px) {
    root.style.setProperty("--glass-blur", px + "px");
    localStorage.setItem(STORAGE_GLASS, String(px));
  }

  function syncThemeButtons() {
    const pref = localStorage.getItem(STORAGE_THEME) || "dark";
    document.querySelectorAll(".theme-choice").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-theme-choice") === pref);
    });
  }

  function init() {
    applyAccent(getAccent());
    applyGlass(getGlass());

    document.querySelectorAll(".glass-slider").forEach((slider) => {
      slider.value = String(getGlass());
      slider.addEventListener("input", (e) => applyGlass(Number(e.target.value)));
    });

    document.querySelectorAll(".accent-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyAccent(btn.getAttribute("data-accent-choice"));
        const wrap = btn.closest(".appearance-switch");
        if (wrap) wrap.classList.remove("open");
      });
    });

    document.querySelectorAll(".theme-choice").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.applyTheme) window.applyTheme(btn.getAttribute("data-theme-choice"));
        const wrap = btn.closest(".appearance-switch");
        if (wrap) wrap.classList.remove("open");
      });
    });

    document.addEventListener("fy:theme-applied", syncThemeButtons);
    syncThemeButtons();

    document.querySelectorAll(".appearance-switch").forEach((wrap) => {
      const trigger = wrap.querySelector(".appearance-trigger");
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".appearance-switch.open, .lang-switch.open").forEach((o) => {
          if (o !== wrap) o.classList.remove("open");
        });
        wrap.classList.toggle("open");
      });
    });

    document.addEventListener("click", (e) => {
      document.querySelectorAll(".appearance-switch.open").forEach((wrap) => {
        if (!wrap.contains(e.target)) wrap.classList.remove("open");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
