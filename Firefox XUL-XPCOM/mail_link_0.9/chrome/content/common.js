/* See https://developer.mozilla.org/en-US/docs/Code_snippets/Toolbar
https://developer.mozilla.org/en-US/docs/XUL/School_tutorial/Appendix_B:_Install_and_Uninstall_Scripts
https://developer.mozilla.org/en-US/docs/XUL/School_tutorial/Handling_Preferences */

/**
 * Installs the toolbar button with the given ID into the given
 * toolbar, if it is not already present in the document.
 *
 * @param {string} toolbarId The ID of the toolbar to install to.
 * @param {string} id The ID of the button to install.
 * @param {string} afterId The ID of the element to insert after. @optional
 */
function installButton(toolbarId, id, afterId) {
    if (!document.getElementById(id)) {
        var toolbar = document.getElementById(toolbarId);
 
        // If no afterId is given, then append the item to the toolbar
        var before = null;
        if (afterId) {
            var elem = document.getElementById(afterId);
            if (elem && elem.parentNode == toolbar)
                before = elem.nextElementSibling;
        }
 
        toolbar.insertItem(id, before);
        toolbar.setAttribute("currentset", toolbar.currentSet);
        document.persist(toolbar.id, "currentset");
 
        if (toolbarId == "addon-bar")
            toolbar.collapsed = false;
    }
}
 
function init() {
    this._prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
 
    if (!this._prefService.getBoolPref("extensions.email_link.firstRunDone")) {
        this._prefService.setBoolPref("extensions.email_link.firstRunDone", true);
        installButton("nav-bar", "email_link-button");
    }
}

window.addEventListener("load", function() { init(); }, false);