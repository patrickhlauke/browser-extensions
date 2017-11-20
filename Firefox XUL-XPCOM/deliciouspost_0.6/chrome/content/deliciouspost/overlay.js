// del.icio.us post 0.5
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - April 2005 / Revised December 2005

// global variables

var delicious_post_url;
var delicious_post_description;

// add listener to context menu popping up
function delicious_post_init(e) {
	var menu = document.getElementById('contentAreaContextMenu');
	menu.addEventListener('popupshowing',delicious_post_context,false);
	return;
}

// context menu popped up. check if the context is for a link or for the page
function delicious_post_context(e) {
	if(gContextMenu.onLink) {
		document.getElementById('delicious-post-context-page').setAttribute('hidden',true);
		document.getElementById('delicious-post-context-link').setAttribute('hidden',false);
		var link =  gContextMenu.target
		delicious_post_url = makeURLAbsolute(document.commandDispatcher.focusedWindow.document.location,link.getAttribute('href'));
		delicious_post_description = gContextMenu.linkText();
	} else {
		document.getElementById('delicious-post-context-page').setAttribute('hidden',false);
		document.getElementById('delicious-post-context-link').setAttribute('hidden',true);
		// delicious_post_url = window.content.document.URL;
		delicious_post_url = window.content.document.location.href;
		delicious_post_description = window.content.document.title;
	}
	return;
}

// toolbar button was clicked
function delicious_post_toolbar() {
	delicious_post_url = window.content.document.location.href;
	delicious_post_description = window.content.document.title;
	delicious_post_submit();
}

// actual function to open dialog, invoked by context menu items
function delicious_post_submit() {
	window.openDialog('chrome://deliciouspost/content/dialogs/submit.xul', '', 'centerscreen,chrome',delicious_post_url,delicious_post_description);
}

window.addEventListener('load', delicious_post_init, false);

