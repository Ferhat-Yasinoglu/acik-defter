/* ==========================================================================
   Navbar — shrinks slightly once the page is scrolled
   ========================================================================== */

(function () {
  function init() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    function onScroll() {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    }

    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
