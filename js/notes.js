/* ==========================================================================
   Notes page — category filter + accordion detail
   ========================================================================== */

(function () {
  function init() {
    const toolbar = document.querySelector(".notes-filters");
    if (!toolbar) return;

    const pills = Array.from(toolbar.querySelectorAll(".filter-pill"));
    const groups = Array.from(document.querySelectorAll(".notes-month-group"));
    const countNum = document.querySelector(".notes-count .num");
    const emptyState = document.querySelector(".notes-empty");

    function applyFilter(filter) {
      let visible = 0;

      groups.forEach((group) => {
        const cards = Array.from(group.querySelectorAll(".note-card"));
        let groupVisible = 0;

        cards.forEach((card) => {
          const match = filter === "all" || card.getAttribute("data-category") === filter;
          card.classList.toggle("is-hidden", !match);
          if (match) {
            groupVisible++;
            visible++;
          }
        });

        group.classList.toggle("is-hidden", groupVisible === 0);
      });

      if (countNum) countNum.textContent = String(visible);
      if (emptyState) emptyState.classList.toggle("show", visible === 0);
    }

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => {
          p.classList.remove("active");
          p.setAttribute("aria-pressed", "false");
        });
        pill.classList.add("active");
        pill.setAttribute("aria-pressed", "true");
        applyFilter(pill.getAttribute("data-filter"));
      });
    });

    document.querySelectorAll(".note-summary").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".note-card");
        const expanded = card.classList.toggle("expanded");
        btn.setAttribute("aria-expanded", String(expanded));
      });
    });

    applyFilter("all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
