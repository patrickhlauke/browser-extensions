/* Wrapped everything into a single anonymous function */

/* See https://developer.mozilla.org/en-US/docs/Code_snippets/Toolbar
https://developer.mozilla.org/en-US/docs/XUL/School_tutorial/Appendix_B:_Install_and_Uninstall_Scripts
https://developer.mozilla.org/en-US/docs/XUL/School_tutorial/Handling_Preferences */

window.addEventListener("load", function() {
    this._prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
 
    if (!this._prefService.getBoolPref("extensions.zoombar.firstRunDone")) {
        this._prefService.setBoolPref("extensions.zoombar.firstRunDone", true);
            if (!document.getElementById('zoombar-toolbar')) {
                var toolbar = document.getElementById('nav-bar');
                toolbar.insertItem('zoombar-toolbar', null);
                toolbar.setAttribute("currentset", toolbar.currentSet);
                document.persist(toolbar.id, "currentset");
            }
    }
}, false);