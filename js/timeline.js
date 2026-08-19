/* ==========================================================================
   Journey timeline — click a milestone to reveal its story
   ========================================================================== */

(function () {
  function init() {
    const cards = document.querySelectorAll(".timeline-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const item = card.closest(".timeline-item");
        const expanded = item.classList.toggle("expanded");
        card.setAttribute("aria-expanded", String(expanded));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
