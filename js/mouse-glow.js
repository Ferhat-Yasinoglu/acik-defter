/* ==========================================================================
   Site-wide ambient glow that follows the cursor
   ========================================================================== */

(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(hover: none)").matches) return;

  const root = document.documentElement;
  let ticking = false;
  let started = false;

  function onMove(e) {
    if (!started) {
      document.body.classList.add("has-mouse-glow");
      started = true;
    }
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
      ticking = false;
    });
  }

  document.addEventListener("mousemove", onMove, { passive: true });
})();
