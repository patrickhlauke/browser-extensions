// dublincore 0.2
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - March 2005 / Revised December 2005

// uses helper functions and globals from chrome://dublincore/content/common.js

// change toolbar and status bar button status (enabled/disabled) based on presence of relevant META or LINK elements

function dublincoreChangeState() {
	var tbutton = document.getElementById('dublincore-toolbarbutton');
	var sbutton = document.getElementById('dublincore-statusbarbutton');
	if (tbutton) tbutton.disabled = true;
	sbutton.disabled = true;
	
	// if there is an actual document to work with
	if (window.content) {
		// quick check of metas
		var metas = window.content.document.getElementsByTagName('meta');
		var links = window.content.document.getElementsByTagName('link');
	
		if ((dc_crawler(metas,'name','content',dcElements,'dc.')) ||
			(dc_crawler(metas,'name','content',dcElementTerms,'dcterms.')) ||
			(dc_crawler(links,'rel','href',dcElements,'dc.')) ||
			(dc_crawler(links,'rel','href',dcElementTerms,'dcterms.'))) {
	
			if (tbutton) tbutton.disabled = false;
			sbutton.disabled = false;
	
		}
	}
}

function dublincoreList() {
	window.open('chrome://dublincore/content/windows/list.xul', 'dublincore-window-list', 'centerscreen,chrome,resizable,width=550,height=350');
}

// add listeners to various necessary parts of the browser, to handle page load/unload and tab switching
function dublincoreInit(e) {
    var contentArea = document.getElementById('appcontent');
    contentArea.addEventListener('select', dublincoreChangeState, false);
    contentArea.addEventListener('unload', dublincoreChangeState, true);
    contentArea.addEventListener('load', dublincoreChangeState, true);
}

// initialise dublincore extension when browser first loaded
window.addEventListener('load', dublincoreInit, false);