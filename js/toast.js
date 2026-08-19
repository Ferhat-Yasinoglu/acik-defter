/* ==========================================================================
   Site-wide toast notifications
   ========================================================================== */

(function () {
  const STORAGE_LANG = "fy-lang";
  let container;

  function getLang() {
    return localStorage.getItem(STORAGE_LANG) || "tr";
  }

  function ensureContainer() {
    if (container) return container;
    container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      container.setAttribute("aria-atomic", "true");
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(key, iconName) {
    const dict = (typeof translations !== "undefined" && translations[getLang()]) || {};
    const message = dict[key];
    if (!message) return;

    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<svg data-lucide="' + (iconName || "check") + '"></svg><span></span>';
    el.querySelector("span").textContent = message;
    ensureContainer().appendChild(el);

    if (window.lucide) lucide.createIcons();

    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));

    setTimeout(() => {
      el.classList.remove("show");
      el.addEventListener("transitionend", () => el.remove(), { once: true });
    }, 3000);
  }

  window.showToast = showToast;

  function init() {
    ensureContainer();

    document.querySelectorAll('a[href*="github.com"]').forEach((a) => {
      a.addEventListener("click", () => showToast("toast_github", "github"));
    });
    document.querySelectorAll('a[href*="linkedin.com"]').forEach((a) => {
      a.addEventListener("click", () => showToast("toast_linkedin", "linkedin"));
    });
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(() => {
          const theme = document.documentElement.getAttribute("data-theme");
          showToast(
            theme === "dark" ? "toast_theme_dark" : "toast_theme_light",
            theme === "dark" ? "moon" : "sun"
          );
        }, 0);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
