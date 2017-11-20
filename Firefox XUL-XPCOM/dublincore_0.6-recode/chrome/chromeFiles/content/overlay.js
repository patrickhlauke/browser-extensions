// dublincore 0.6
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - March 2005 / Revised May 2008

// uses helper functions and globals from chrome://dublincore/content/common.js

// change toolbar and status bar button status (enabled/disabled) based on presence of relevant META or LINK elements

function dublincoreList() {
	window.open('chrome://dublincore/content/windows/list.xul', 'dublincore-window-list', 'centerscreen,chrome,resizable,width=550,height=350');
}

function dublincoreChangeState(event) {

	// if this was fired by a load event, make sure the load originated from HTMLDocument, not for a XUL load
	if ((event.type == 'load')&&(!(event.originalTarget instanceof HTMLDocument))) { return; }

	var tbutton = document.getElementById('dublincore-toolbarbutton');
	var sbutton = document.getElementById('dublincore-statusbarbutton');
	
	// turn off buttons
	if (tbutton) tbutton.disabled = true;
	if (sbutton) sbutton.disabled = true;

	// if there is an actual document to work with
	if (window.content) {
		// quick check of metas - xpath for namespaced documents (e.g. xhtml sent as xhtml+xml or similar) unioned with non-namespaced ones 
		var m = window.content.document.evaluate("//*[name()='meta' and contains(@name,'dc.')] | //*[name()='meta' and contains(@name,'dcterms.')] | //meta[contains(@name,'dc.')] | //meta[contains(@name,'dcterms.')]", window.content.document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var l = window.content.document.evaluate("//*[name()='link' and contains(@rel,'DC.')] | //*[name()='link' and contains(@rel,'DCTERMS.')] | //link[contains(@rel,'DC.')] | //link[contains(@rel,'DCTERMS.')]", window.content.document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		alert('metas: '+m.snapshotLength);
		alert('links: '+l.snapshotLength);
		if ((m.snapshotLength > 0)||(l.snapshotLength > 0)) {
			if (tbutton) tbutton.disabled = false;
			if (sbutton) sbutton.disabled = false;
		}
	}
}

// add listeners to various necessary parts of the browser, to handle page load/unload and tab switching
function dublincoreInit(e) {
	gBrowser.tabContainer.addEventListener('TabSelect', dublincoreChangeState, false);
    gBrowser.addEventListener('load', dublincoreChangeState, true);
}

// initialise dublincore extension when browser first loaded
window.addEventListener('load', dublincoreInit, false);