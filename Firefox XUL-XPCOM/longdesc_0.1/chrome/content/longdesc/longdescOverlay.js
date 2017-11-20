// Longdesc script - adds "View Image Longdesc: ..." to the image context menu
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - 17 Sept 2004
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
	var newlongdescurl = "";
	// check what form the longdesc attribute takes. if it's not a fully qualified domain url
	// add the current domain/path to it, depending on whether the longdesc is relative to the
	// current document or relative to the site root, starting with a single slash /
	if (longdescurl.substr(0,4)!="http") {
		newlongdescurl = "http://"+document.commandDispatcher.focusedWindow.document.location.host;
		if ((longdescurl.substr(0,1)!="/")&&(longdescurl.substr(0,1)!="#")) {
			// strip any filename etc from the current path
			var currentpath = document.commandDispatcher.focusedWindow.document.location.pathname;
			var index = currentpath.indexOf("/");
			var lastindex = 0;
			while (index != -1) {
				lastindex = index;
				index = currentpath.indexOf("/", index + 1); // start search after last match found 
			}
			newlongdescurl += currentpath.substr(0,lastindex)+"/";
		} else if (longdescurl.substr(0,1)=="#")  {
			newlongdescurl += document.commandDispatcher.focusedWindow.document.location.pathname;
		}
		newlongdescurl += longdescurl;
		longdescurl = newlongdescurl;
	}
	document.commandDispatcher.focusedWindow.document.location = longdescurl;
//	window.open(longdescurl,'imagelongdesc');
	return;
}

window.addEventListener("load", longdescImageInit, false);