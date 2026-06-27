(function () {
  var MODAL_ID = "modal-booking-dev-notice";
  var BODY_CLASS = "booking-dev-blocked";
  var STYLE_ID = "booking-dev-guard-styles";
  var wrappedFn = null;
  var devNoticeOpen = false;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      "#modal-booking-dev-notice{z-index:2147483647!important;}" +
      "body.booking-dev-blocked .overlay.nsm-overlay-open," +
      "body.booking-dev-blocked .overlay.nsm-overlay-open *{pointer-events:none!important;}";
    document.head.appendChild(style);
  }

  function getModal() {
    return document.getElementById(MODAL_ID);
  }

  function openDevNotice() {
    var modal = getModal();
    if (!modal || devNoticeOpen) return;
    ensureStyles();
    devNoticeOpen = true;
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add(BODY_CLASS);
    var closeBtn = modal.querySelector("[data-booking-dev-close]");
    if (closeBtn && typeof closeBtn.focus === "function") closeBtn.focus();
  }

  function closeDevNotice() {
    var modal = getModal();
    if (!modal) return;
    devNoticeOpen = false;
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove(BODY_CLASS);
  }

  function scheduleOpenDevNotice() {
    window.setTimeout(openDevNotice, 0);
    window.setTimeout(openDevNotice, 120);
    window.setTimeout(openDevNotice, 400);
    window.setTimeout(openDevNotice, 900);
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

  function createGuarded(fn) {
    return function guardedInitMyOrder() {
      if (typeof fn === "function") fn();
      scheduleOpenDevNotice();
    };
  }

  function installInitMyOrderTrap() {
    var existing = window.initMyOrder;
    try {
      Object.defineProperty(window, "initMyOrder", {
        configurable: true,
        enumerable: true,
        get: function () {
          return wrappedFn;
        },
        set: function (fn) {
          wrappedFn = typeof fn === "function" ? createGuarded(fn) : undefined;
        },
      });
    } catch (err) {
      return false;
    }
    if (typeof existing === "function") window.initMyOrder = existing;
    return true;
  }

  function wrapInitMyOrderDirect() {
    if (typeof window.initMyOrder !== "function") return false;
    if (window.initMyOrder.__bookingDevGuarded) return true;
    var original = window.initMyOrder;
    var guarded = createGuarded(original);
    guarded.__bookingDevGuarded = true;
    window.initMyOrder = guarded;
    return true;
  }

  function onBookerOpened() {
    if (!document.body.classList.contains("dialog-open")) return;
    scheduleOpenDevNotice();
  }

  ensureStyles();
  if (!installInitMyOrderTrap()) wrapInitMyOrderDirect();

  var attempts = 0;
  var timer = window.setInterval(function () {
    if (wrapInitMyOrderDirect() || ++attempts > 200) window.clearInterval(timer);
  }, 100);

  if (document.body) {
    var bodyObserver = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === "class" && document.body.classList.contains("dialog-open")) {
          onBookerOpened();
          break;
        }
      }
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  document.addEventListener(
    "click",
    function (e) {
      var btn = e.target.closest("button[onclick*='initMyOrder']");
      if (btn) scheduleOpenDevNotice();
    },
    true
  );

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
