(function () {
  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.removeAttribute("hidden");
    el.classList.remove("opacity-0", "pointer-events-none");
    el.classList.add("opacity-100");
    document.body.style.overflow = "hidden";
    var focusable = el.querySelectorAll('button, [href], input, select, textarea');
    var first = focusable[0];
    if (first) first.focus();
    el.setAttribute("aria-hidden", "false");
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("hidden", "");
    el.classList.add("opacity-0", "pointer-events-none");
    el.classList.remove("opacity-100");
    document.body.style.overflow = "";
    el.setAttribute("aria-hidden", "true");
  }

  function handleClose(e) {
    var id = e.target.closest("[aria-modal=true]");
    if (!id) return;
    closeModal(id.id);
  }

  document.addEventListener("click", function (e) {
    var seeMore = e.target.closest(".service-see-more");
    if (seeMore) {
      e.preventDefault();
      var card = seeMore.closest(".service-card");
      if (!card) return;
      var titleEl = card.querySelector("h3");
      var bodyEl = card.querySelector(".service-full-description");
      var title = titleEl ? titleEl.textContent.trim() : "Service";
      var body = bodyEl ? bodyEl.textContent.trim() : "";
      var modalTitle = document.getElementById("modal-service-detail-title");
      var modalBody = document.getElementById("modal-service-detail-body");
      if (modalTitle) modalTitle.textContent = title;
      if (modalBody) modalBody.textContent = body;
      openModal("modal-service-detail");
      return;
    }
    if (e.target.matches("[data-modal-open]")) {
      e.preventDefault();
      var id = e.target.getAttribute("data-modal-open") || e.target.getAttribute("href");
      if (id && id.startsWith("#")) id = id.slice(1);
      if (id) openModal(id);
    }
    if (e.target.matches("[data-modal-close]")) {
      e.preventDefault();
      var modal = e.target.closest("[aria-modal=true]");
      if (modal) closeModal(modal.id);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = document.querySelector("[aria-modal=true]:not([hidden])");
    if (open) closeModal(open.id);
  });
})();
