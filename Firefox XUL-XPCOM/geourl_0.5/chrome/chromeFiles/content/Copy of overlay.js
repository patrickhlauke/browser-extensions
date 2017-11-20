// GeoURL 0.4
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - May 2005 / Reviewed December 2005
// Some code elements inspired by Chris Pederick's Web Developer Extension http://www.chrispederick.com

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
	var preferred;
	if(preferencesService.prefHasUserValue('destinations_preferred')) {
		preferred = preferencesService.getIntPref('destinations_preferred');
	} else {
		preferred = 1;
	}
	
	var label = preferencesService.getCharPref('destinations_'+preferred+'_label');
	var url = preferencesService.getCharPref('destinations_'+preferred+'_url');
	var statusbutton = document.getElementById('geourl-statusbarbutton');
	if (statusbutton) {
		statusbutton.setAttribute('label',label);
		statusbutton.setAttribute('tooltiptext',label);
		statusbutton.setAttribute('oncommand',"geourlOpen('"+url+"')");
	}
}

function geourlBuildMenu() {
	var menuseparator = document.getElementById('geourl-statusbar-menuseparator');
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch('extensions.geourl.');
	if(preferencesService.prefHasUserValue('destinations_preferred')) {
		preferred = preferencesService.getIntPref('destinations_preferred');
	} else {
		preferred = 1;
	}
	var label = preferencesService.getCharPref('destinations_'+preferred+'_label');
	var url = preferencesService.getCharPref('destinations_'+preferred+'_url');
	var defaultitem = document.getElementById('geourl-destination-default');
	defaultitem.setAttribute('label',label);
	defaultitem.setAttribute('oncommand',"geourlOpen('"+url+"')");

		var menu = document.getElementById('geourl-statusbar-menu');
	
		// destroy current menu
		
		/* 
		var olditems = document.getElementsByAttribute('class','geourl-generated');
		var i=0, j=olditems.length, menuitem;
		alert('old: '+olditems.length);
		for (i=0; i<j; i=i+1) {
			alert(i+' - '+olditems[i].label);
			menu.removeChild(olditems[i]);
		} */
		while(menu.hasChildNodes()) menu.removeChild(menu.firstChild);
	
		// rebuild the menu

		var count = preferencesService.getIntPref('destinations_count');
		i=1;
		for (i=1; i<=count; i++) {
				var label = preferencesService.getCharPref('destinations_'+i+'_label');
				var url = preferencesService.getCharPref('destinations_'+i+'_url');
				menuitem  = document.createElement('menuitem');
				menuitem.setAttribute('label',label);
				menuitem.setAttribute('oncommand',"geourlOpen('"+url+"')");
				menuitem.setAttribute('class','geourl-generated');
				menu.appendChild(menuitem);
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