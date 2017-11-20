// GeoURL 0.3
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - May 2005
// Some code elements inspired by Chris Pederick's Web Developer Extension http://www.chrispederick.com

// global variables
var gGeourlLat;
var gGeourlLong;
var gGeourlSetup;

// initialise geourl extension when browser first loaded
window.addEventListener("load", geourlInit, false);

// *********************************************************************
// add listeners to various necessary parts of the browser, to handle
// page load/unload and tab switching
// *********************************************************************

function geourlInit(e) {
	var contentArea = document.getElementById("appcontent");
	if(contentArea)
    {
        try {
            contentArea.removeEventListener("select", geourlChangeState, true);
        } catch(exception) {
            // Do nothing
        }
        contentArea.addEventListener("select", geourlChangeState, true);
    }

	// Try to remove the load event listener
    try
    {
        window.removeEventListener("load", geourlChangeState, true);
    }
    catch(exception)
    {
        // Do nothing
    }

    window.addEventListener("load", geourlChangeState, true);

	if (!gGeourlSetup) {
		geourlSetup();
	}
	
	var sb = document.getElementById("geourl-statusbar");
	if (sb) {
		try {
			sb.removeEventListener("focus", geourlChangeButton, true);
			sb.removeEventListener("mouseover", geourlChangeButton, true);
			sb.removeEventListener("click", geourlChangeButton, true);
			sb.removeEventListener("contextmenu", geourlBuildMenu, true);
		} catch (exception) {
			// do nothing
		}
		sb.addEventListener("focus", geourlChangeButton, true);
		sb.addEventListener("mouseover", geourlChangeButton, true);
		sb.addEventListener("click", geourlChangeButton, true);
		sb.addEventListener("contextmenu", geourlBuildMenu, true);
	}
}


// *********************************************************************
// first run ... set some defaults
// *********************************************************************

function geourlSetup()
{
    var bundle=document.getElementById('geourl-string-bundle');

	// If the string bundle is set
    if(bundle)
    {
        const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
        const string             = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var i,j;

        // use default.properties from the locale to prepopulate default destinations - these will later be customisable
		
        if(!preferencesService.prefHasUserValue("geourl.destinations.count"))
        {
			string.data = bundle.getString("geourl_destinations_count");
            preferencesService.setIntPref("geourl.destinations.count", parseInt(string));
        }
		
		j = string.data;
		for(i=1; i<=j; i++) {
			if(!preferencesService.prefHasUserValue("geourl.destinations."+i+".label"))
			{
				string.data = bundle.getString("geourl_destinations_"+i+"_label");
				preferencesService.setComplexValue("geourl.destinations."+i+".label", Components.interfaces.nsISupportsString, string);
			}
			if(!preferencesService.prefHasUserValue("geourl.destinations."+i+".url"))
        	{
            	string.data = bundle.getString("geourl_destinations_"+i+"_url");
            	preferencesService.setComplexValue("geourl.destinations."+i+".url", Components.interfaces.nsISupportsString, string);
        	}
		}
		
		if(!preferencesService.prefHasUserValue("geourl.destinations.preferred"))
        {
			string.data = bundle.getString("geourl_destinations_preferred");
            preferencesService.setIntPref("geourl.destinations.preferred", parseInt(string));
        }
	}
	gGeourlSetup = true;
}


// *********************************************************************
// event handlers
// *********************************************************************


// change status bar button (enabled/disabled) based on presence of relevant META elements
function geourlChangeState() {
	
	// hide any existing popup menu - a kludge to work around a FF bug which would otherwise leave the context menu visible
	var menu
	if (menu = document.getElementById('geourl-statusbar-menu')) menu.hidePopup();
	if (menu = document.getElementById('geourl-statusbar-menu-disabled')) menu.hidePopup();
	//

	var regexp_clean = new RegExp('[^0-9;,.-]', "g");
	var sbutton = document.getElementById("geourl-statusbarbutton");
	if (sbutton) {
		sbutton.disabled = true;
		sbutton.setAttribute('context',"geourl-statusbar-menu-disabled");
	}
	if (window.content) {
		var metas = window.content.document.getElementsByTagName("META");
		if (metas) {
			for (i=0; i < metas.length; i++) {
				metas[i].name=metas[i].name.toLowerCase();
				if ((metas[i].name=='icbm')||(metas[i].name=='geo.position')) {
					if (sbutton) {
						sbutton.disabled = false;
						sbutton.setAttribute('context',"geourl-statusbar-menu");
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
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	if(preferencesService.prefHasUserValue("geourl.destinations.preferred")) {
		var preferred = preferencesService.getIntPref('geourl.destinations.preferred');
		var label = preferencesService.getCharPref('geourl.destinations.'+preferred+'.label');
		var url = preferencesService.getCharPref('geourl.destinations.'+preferred+'.url');
		var statusbutton = document.getElementById('geourl-statusbarbutton');
		if (statusbutton) {
			statusbutton.setAttribute('label',label);
			statusbutton.setAttribute('tooltiptext',label);
			statusbutton.setAttribute('oncommand',"geourlOpen('"+url+"')");
		}
	}
}

function geourlBuildMenu() {
	var menuseparator = document.getElementById('geourl-statusbar-menuseparator');
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	if(preferencesService.prefHasUserValue("geourl.destinations.preferred")) {
		var preferred = preferencesService.getIntPref('geourl.destinations.preferred');
		var label = preferencesService.getCharPref('geourl.destinations.'+preferred+'.label');
		var url = preferencesService.getCharPref('geourl.destinations.'+preferred+'.url');
		var defaultitem = document.getElementById('geourl-destination-default');
		defaultitem.setAttribute('label',label);
		defaultitem.setAttribute('oncommand',"geourlOpen('"+url+"');");
	}
	if(preferencesService.prefHasUserValue("geourl.destinations.count")) {

		var menu = document.getElementById('geourl-statusbar-menu');
	
		// destroy current menu
		
		var olditems = document.getElementsByAttribute('class','geourl-generated');
		var i, menuitem;
		for (i=0; i<olditems.length; i++) {
			menu.removeChild(olditems[i]);
		}		
	
		// rebuild the menu

		var count = preferencesService.getIntPref('geourl.destinations.count');

		for (i=1; i<=count; i++) {
			if (i!=preferred) {
				var label = preferencesService.getCharPref('geourl.destinations.'+i+'.label');
				var url = preferencesService.getCharPref('geourl.destinations.'+i+'.url');
				menuitem  = document.createElement("menuitem");
				menuitem.setAttribute('label',label);
				menuitem.setAttribute('oncommand',"geourlOpen('"+url+"')");
				menuitem.setAttribute('class','geourl-generated');
				menu.insertBefore(menuitem,menuseparator);
			}
		}
		
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
	window.openDialog("chrome://geourl/content/dialogs/options.xul", '', "centerscreen,chrome,modal");
}