var longdescAbsolute, longdescOriginal;

function notify(message) {
  longdescAbsolute = message.longdescAbsolute;
  longdesc = message.longdesc;
  if (longdescAbsolute) {
    browser.contextMenus.update("image-longdesc-context-menu", {
      title: "View image long description: "+longdesc,
      enabled: true
    });
  } else {
    browser.contextMenus.update("image-longdesc-context-menu", {
      title: "View image long description",
      enabled: false
    });
  }
}

browser.runtime.onMessage.addListener(notify);

browser.contextMenus.create({
  id: "image-longdesc-context-menu",
  title: "View image long description",
  contexts: ["image"],
  enabled: false
});


browser.contextMenus.onClicked.addListener((info, tab) => {
  if ((info.menuItemId === "image-longdesc-context-menu") && longdesc) {
    browser.tabs.create({
      "url": longdescAbsolute
    });
  }
});