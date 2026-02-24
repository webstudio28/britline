(function () {
  var strip = document.querySelector(".popular-transfers-strip");
  if (!strip) return;

  var setEl = strip.querySelector(".popular-transfers-strip-set");
  if (!setEl) return;

  var setWidth = setEl.offsetWidth;
  var position = 0;
  var dragging = false;
  var startX = 0;
  var startPos = 0;
  var speed = 0.6;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function tick() {
    if (!dragging) {
      position -= speed;
      if (position < -setWidth) position += setWidth;
      if (position > 0) position -= setWidth;
    }
    strip.style.transform = "translateX(" + position + "px)";
    requestAnimationFrame(tick);
  }

  function onDown(e) {
    dragging = true;
    startX = getClientX(e);
    startPos = position;
    strip.style.cursor = "grabbing";
  }

  function onMove(e) {
    if (!dragging) return;
    var x = getClientX(e);
    position = startPos + (x - startX);
  }

  function onUp() {
    dragging = false;
    strip.style.cursor = "grab";
    while (position < -setWidth) position += setWidth;
    while (position > 0) position -= setWidth;
  }

  strip.style.cursor = "grab";
  strip.style.willChange = "transform";

  strip.addEventListener("mousedown", onDown);
  strip.addEventListener("touchstart", onDown, { passive: true });
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  if (setWidth > 0) requestAnimationFrame(tick);
  else window.addEventListener("load", function () {
    setWidth = setEl.offsetWidth;
    requestAnimationFrame(tick);
  });
})();
