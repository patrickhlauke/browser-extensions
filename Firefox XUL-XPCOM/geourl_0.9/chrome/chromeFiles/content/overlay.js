// Geo extension 0.7 (formerly GeoURL)
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - May 2005 / Reviewed October 2007

// global variables
var gGeourlLat;
var gGeourlLong;

// initialise geourl extension when browser first loaded
window.addEventListener('load', geourlInit, false);

// *********************************************************************
// add listeners to various necessary parts of the browser, to handle
// page load/unload and tab switching
// *********************************************************************

function geourlInit(e) {
    var contentArea = document.getElementById('appcontent');
    contentArea.addEventListener('select', geourlChangeState, false);
    contentArea.addEventListener('unload', geourlChangeState, true);
    contentArea.addEventListener('load', geourlChangeState, true);
	
	var sb = document.getElementById('geourl-statusbar');
	if (sb) {
		try {
			sb.removeEventListener('focus', geourlChangeButton, true);
			sb.removeEventListener('mouseover', geourlChangeButton, true);
			sb.removeEventListener('click', geourlChangeButton, true);
			sb.removeEventListener('contextmenu', geourlBuildMenu, true);
		} catch (exception) {
			// do nothing
		}
		sb.addEventListener('focus', geourlChangeButton, true);
		sb.addEventListener('mouseover', geourlChangeButton, true);
		sb.addEventListener('click', geourlChangeButton, true);
		sb.addEventListener('contextmenu', geourlBuildMenu, true);
	}
}


// *********************************************************************
// event handlers
// *********************************************************************


// change status bar button (enabled/disabled) based on presence of relevant META elements
function geourlChangeState() {
	
	// hide any existing popup menu - a kludge to work around a FF bug which would otherwise leave the context menu visible
	var menu;
	if ((menu = document.getElementById('geourl-statusbar-menu'))) menu.hidePopup();
	if ((menu = document.getElementById('geourl-statusbar-menu-disabled'))) menu.hidePopup();
	//

	var regexp_clean = new RegExp('[^0-9;,.-]','g');
	var sbutton = document.getElementById('geourl-statusbarbutton');
	if (sbutton) {
		sbutton.disabled = true;
		sbutton.setAttribute('context','geourl-statusbar-menu-disabled');
	}
	if (window.content) {
		var metas = window.content.document.getElementsByTagName('meta');
		if (metas) {
			for (i=0; i < metas.length; i++) {
				metas[i].name=metas[i].name.toLowerCase();
				if ((metas[i].name=='icbm')||(metas[i].name=='geo.position')) {
					if (sbutton) {
						sbutton.disabled = false;
						sbutton.setAttribute('context','geourl-statusbar-menu');
					}
					var value = metas[i].content;
					value = value.replace(regexp_clean,'');
					value = value.replace(';',',');
					var coordinates = value.split(',');
					gGeourlLat=coordinates[0];
					gGeourlLong=coordinates[1];
				}
			}
		}
	}
}

function geourlChangeButton() {
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch('extensions.geourl.');
	var preferred = preferencesService.getIntPref('destinations_preferred');
	var destinations = preferencesService.getCharPref('destinations');
	var destinations_array = eval('(' + destinations + ')');
	var j=0;
	for (var i in destinations_array) {
		j++;
		if (preferred == j) {
			var label = i;
			var url = destinations_array[i];
		}
	}
	var statusbutton = document.getElementById('geourl-statusbarbutton');
	if (statusbutton) {
		statusbutton.setAttribute('label',label);
		statusbutton.setAttribute('tooltiptext',label);
		statusbutton.setAttribute('oncommand',"geourlOpen('"+url+"')");
	}
}

function geourlBuildMenu() {
	var separator = document.getElementById('geourl-statusbar-menuseparator-end');
	var menu = document.getElementById('geourl-statusbar-menu');
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch('extensions.geourl.');
	var preferred = preferencesService.getIntPref('destinations_preferred');
	var destinations = preferencesService.getCharPref('destinations');
	var destinations_array = eval('(' + destinations + ')');
	var j=0;
	for (var i in destinations_array) {
		j++;
		if (preferred == j) {
			var label = i;
			var url = destinations_array[i];
		}
	}
	
	var defaultitem = document.getElementById('geourl-destination-default');
	defaultitem.setAttribute('label',label);
	defaultitem.setAttribute('oncommand',"geourlOpen('"+url+"')");

	while(separator.previousSibling.id!='geourl-statusbar-menuseparator-begin') menu.removeChild(separator.previousSibling);

	// rebuild the menu
	var destinations = preferencesService.getCharPref('destinations');
	var destinations_array = eval('(' + destinations + ')');
	for (var i in destinations_array) {
		var label = i;
		var url = destinations_array[i];
		menuitem  = document.createElement('menuitem');
		menuitem.setAttribute('label',label);
		menuitem.setAttribute('oncommand',"geourlOpen('"+url+"')");
		menuitem.setAttribute('class','geourl-generated');
		menu.insertBefore(menuitem,separator);
	}
}


// open new tab with found geo position
function geourlOpen(destination) {
	destination = destination.replace('\[LAT\]',gGeourlLat);
	destination = destination.replace('\[LONG\]',gGeourlLong);
    const newTab = getBrowser().addTab(destination);
	getBrowser().selectedTab = newTab;
}


// simple function to open the extension's options dialog
function geourlOptions() {
	window.openDialog('chrome://geourl/content/dialogs/options.xul','', 'centerscreen,resizable,chrome,modal');
}