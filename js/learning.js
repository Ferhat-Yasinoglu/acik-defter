/* ==========================================================================
   Learning page — animate skill progress bars on load
   ========================================================================== */

(function () {
  function init() {
    const fills = document.querySelectorAll(".skill-fill");
    if (!fills.length) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fills.forEach((el) => {
          el.style.width = el.getAttribute("data-pct") + "%";
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
