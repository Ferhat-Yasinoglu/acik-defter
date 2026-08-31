/* ==========================================================================
   Kaydırma animasyonu — öğeler görünür alana girince beliriyor.

   Üç şeye dikkat edildi:
   - Hareketi azaltmayı seçmiş kullanıcıda hiç çalışmaz.
   - IntersectionObserver desteklenmiyorsa hiçbir şey gizlenmez; animasyon
     olmadığında içerik olduğu gibi durur.
   - İlk ekranda görünen öğeler beklemez; sayfa açılır açılmaz belirirler.
   ========================================================================== */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var SELECTOR = [
    ".hero-copy > *",
    ".hero-card",
    ".section-head",
    ".pcard",
    ".noteitem",
    ".rail-item",
    ".now-band",
    ".card",
    ".facts",
    ".page-head > *",
    ".filters",
  ].join(", ");

  function init() {
    var items = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    if (!items.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.02 }
    );

    items.forEach(function (el, i) {
      el.classList.add("reveal");
      /* Kardeşler peş peşe belirsin; gecikme birikmesin diye altıda duruyor. */
      el.style.transitionDelay = Math.min(i, 6) * 50 + "ms";
      io.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
