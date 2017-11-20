// printimage 0.2 - adds "Print Image ..." to the image context menu
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - 26Sept 2004

// global vars

var printImageUrl = "";
var printImageNewWindow = "";

var printImage = {

	// add listener to context menu popping up
	
	load: function() {
		var menu = document.getElementById("contentAreaContextMenu");
		try {
			menu.addEventListener("popupshowing",printImage.popuphandler,false);
		}
		catch(e) {}
	},
	
	// context menu popped up. check if the context is for an image, and if so show the menu item
	
	popuphandler: function() {
		document.getElementById("printimage-context").hidden = true;
		if( gContextMenu.onImage ) {
			var imgNode = gContextMenu.target;
			printImageUrl = imgNode.getAttribute("src");
			if (printImageUrl) {	
				document.getElementById("printimage-context").hidden = false;
			}
		}
	},
	
	// perform the actual printimage action
	
	print: function() {
		printImageNewWindow = document.commandDispatcher.focusedWindow.open(makeURLAbsolute(document.commandDispatcher.focusedWindow.document.location,printImageUrl));
		printImageNewWindow.focus();
		setTimeout('printImageNewWindow.print()',1000); // wait a second, to give the browser time to load the image
		return;
	}
};

window.addEventListener("load", printImage.load, false);