(function () {
  var MODAL_ID = "modal-booking-dev-notice";
  var BODY_CLASS = "booking-dev-blocked";
  var wrapped = false;

  function getModal() {
    return document.getElementById(MODAL_ID);
  }

  function openDevNotice() {
    var modal = getModal();
    if (!modal) return;
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add(BODY_CLASS);
    var closeBtn = modal.querySelector("[data-booking-dev-close]");
    if (closeBtn && typeof closeBtn.focus === "function") closeBtn.focus();
  }

  function closeDevNotice() {
    var modal = getModal();
    if (!modal) return;
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove(BODY_CLASS);
  }

  function findWebBookerCloseButton() {
    var selectors = [".nsm-dialog-btn-close", "button.nsm-dialog-btn-close"];
    var i;
    for (i = 0; i < selectors.length; i++) {
      var btn = document.querySelector(selectors[i]);
      if (btn) return btn;
    }
    var host = document.querySelector("popup-widget");
    if (host && host.shadowRoot) {
      for (i = 0; i < selectors.length; i++) {
        var shadowBtn = host.shadowRoot.querySelector(selectors[i]);
        if (shadowBtn) return shadowBtn;
      }
    }
    return null;
  }

  function closeWebBooker() {
    var closeBtn = findWebBookerCloseButton();
    if (closeBtn) closeBtn.click();
    document.body.classList.remove("dialog-open");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.overscrollBehavior = "";
  }

  function closeAll() {
    closeDevNotice();
    closeWebBooker();
  }

  function guardedInitMyOrder() {
    if (typeof window.__initMyOrderOriginal === "function") {
      window.__initMyOrderOriginal();
    }
    window.setTimeout(openDevNotice, 0);
    window.setTimeout(openDevNotice, 120);
    window.setTimeout(openDevNotice, 400);
  }

  function wrapInitMyOrder() {
    if (wrapped || typeof window.initMyOrder !== "function") return wrapped;
    window.__initMyOrderOriginal = window.initMyOrder;
    window.initMyOrder = guardedInitMyOrder;
    wrapped = true;
    return true;
  }

  var attempts = 0;
  var timer = window.setInterval(function () {
    if (wrapInitMyOrder() || ++attempts > 120) window.clearInterval(timer);
  }, 100);

  document.addEventListener("click", function (e) {
    var modal = getModal();
    if (!modal || modal.hasAttribute("hidden")) return;
    if (e.target.closest("[data-booking-dev-close]")) {
      e.preventDefault();
      closeAll();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var modal = getModal();
    if (modal && !modal.hasAttribute("hidden")) closeAll();
  });
})();
