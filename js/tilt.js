/* ==========================================================================
   Project cards — subtle 3D tilt that follows the cursor
   ========================================================================== */

(function () {
  const MAX_TILT_DEG = 6;

  function init() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const cards = document.querySelectorAll(".project-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", (-y * MAX_TILT_DEG).toFixed(2) + "deg");
        card.style.setProperty("--tilt-y", (x * MAX_TILT_DEG).toFixed(2) + "deg");
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
