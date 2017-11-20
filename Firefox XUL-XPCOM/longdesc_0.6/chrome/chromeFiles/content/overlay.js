// Longdesc 0.21 script - adds "View Image Longdesc: ..." to the image context menu
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - 26Sept 2004
// inspired by http://showimage.mozdev.org/ and the invaluable tutorial at http://extensions.roachfiend.com/howto.php

var imgNode = "";
var longdescurl = "";

// add listener to context menu popping up
function longdescImageInit(e) {
	var menu = document.getElementById("contentAreaContextMenu");
	menu.addEventListener("popupshowing",showLongdescContext,false);
	return;
}

// context menu popped up. check if the context is for an image, and if so show the menu item
function showLongdescContext(e) {
	document.getElementById("longdesc").hidden = true;
	if( gContextMenu.onImage ) {
		imgNode = gContextMenu.target;
		longdescurl = imgNode.getAttribute("longdesc");
		if (longdescurl) {	
			document.getElementById("longdesc").hidden = false;
			document.getElementById("longdesc").label = "View Image Longdesc: "+longdescurl;
		}
	}
	return;
}

// perform the actual longdesc action
function performShowLongdesc() {
	loadURI(makeURLAbsolute(document.commandDispatcher.focusedWindow.document.location,longdescurl),null,null);
	return;
}

window.addEventListener("load", longdescImageInit, false);