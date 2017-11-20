function notifyExtension(e) {
  var target = e.target;
  var longdesc, longdescAbsolute;
  while ((target.tagName != "IMG") && target.parentNode) {
    target = target.parentNode;
  }
  if (target.tagName != "IMG")
    return;
  longdesc = target.getAttribute("longdesc");
  if (longdesc) {
    longdescAbsolute = new URL(longdesc, document.location);
    longdescAbsolute = longdescAbsolute.href;
  }
  browser.runtime.sendMessage({"longdesc": longdesc, "longdescAbsolute": longdescAbsolute});
}

window.addEventListener("contextmenu", notifyExtension);