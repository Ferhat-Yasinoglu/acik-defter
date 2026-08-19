/* ==========================================================================
   Contact page — Formspree AJAX submit + success/error states
   ========================================================================== */

(function () {
  function init() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const panel = form.closest(".contact-form-panel");
    const successEl = panel.querySelector(".status-success");
    const errorEl = panel.querySelector(".status-error");
    const submitBtn = form.querySelector(".form-submit");
    const retryBtn = panel.querySelector(".form-retry");

    function showForm() {
      form.classList.remove("is-hidden");
      successEl.hidden = true;
      errorEl.hidden = true;
    }

    function showSuccess() {
      form.classList.add("is-hidden");
      errorEl.hidden = true;
      successEl.hidden = false;
    }

    function showError() {
      errorEl.hidden = false;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      submitBtn.classList.add("is-sending");
      submitBtn.disabled = true;
      errorEl.hidden = true;

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (res.ok) {
          showSuccess();
          form.reset();
        } else {
          showError();
        }
      } catch (err) {
        showError();
      } finally {
        submitBtn.classList.remove("is-sending");
        submitBtn.disabled = false;
      }
    });

    if (retryBtn) retryBtn.addEventListener("click", showForm);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
