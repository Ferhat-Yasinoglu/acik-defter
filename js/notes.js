/* ==========================================================================
   Notlar sayfası — kategori süzgeci.

   JavaScript kapalıysa hiçbir şey olmaz: bütün notlar görünür kalır ve
   ayrıntılar <details> olduğu için yine açılıp kapanır. Süzgeç yalnızca
   bir kolaylık.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var bar = document.querySelector(".filters");
    if (!bar) return;

    var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-filter]"));
    var notes = Array.prototype.slice.call(document.querySelectorAll("[data-cat]"));
    var countEl = document.querySelector(".filter-count .num");
    var countLabel = document.querySelector(".filter-count .word");
    var empty = document.querySelector(".empty");
    var active = "all";

    function render() {
      var visible = 0;

      notes.forEach(function (note) {
        var match = active === "all" || note.getAttribute("data-cat") === active;
        note.classList.toggle("is-hidden", !match);
        if (match) visible++;
      });

      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === active));
      });

      if (countEl) countEl.textContent = String(visible);
      if (countLabel) {
        var dict = translations[document.documentElement.getAttribute("lang")] || {};
        var key = visible === 1 ? "notes_count_one" : "notes_count_many";
        if (dict[key]) countLabel.textContent = dict[key];
      }
      if (empty) empty.hidden = visible !== 0;
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        active = b.getAttribute("data-filter");
        render();
      });
    });

    /* Dil değişince tekil/çoğul etiketi de yenilenmeli. */
    document.addEventListener("site:lang", render);

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
