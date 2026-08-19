/* ==========================================================================
   Simple dot-follower custom cursor (mouse-capable, motion-safe devices only)
   ========================================================================== */

(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(hover: none)").matches) return;

  const HOVER_SELECTOR = "a, button, .filter-pill, .accent-swatch, .theme-choice, input[type='range']";
  const TEXT_SELECTOR = "input[type='text'], input[type='email'], input:not([type]), textarea";

  const dot = document.createElement("div");
  dot.className = "custom-cursor";
  document.body.appendChild(dot);
  document.documentElement.classList.add("has-custom-cursor");

  let x = -100;
  let y = -100;
  let ticking = false;

  function paint() {
    dot.style.transform = "translate3d(" + x + "px," + y + "px, 0) translate(-50%, -50%)";
    ticking = false;
  }

  function onMove(e) {
    x = e.clientX;
    y = e.clientY;
    dot.classList.add("is-visible");
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(paint);
    }
  }

  document.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mouseleave", () => dot.classList.remove("is-visible"));

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(TEXT_SELECTOR)) {
      dot.classList.add("is-text");
      dot.classList.remove("is-hover");
    } else if (e.target.closest(HOVER_SELECTOR)) {
      dot.classList.add("is-hover");
      dot.classList.remove("is-text");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const related = e.relatedTarget;
    const stillInside =
      related && related.closest && (related.closest(HOVER_SELECTOR) || related.closest(TEXT_SELECTOR));
    if (!stillInside) dot.classList.remove("is-hover", "is-text");
  });
})();
