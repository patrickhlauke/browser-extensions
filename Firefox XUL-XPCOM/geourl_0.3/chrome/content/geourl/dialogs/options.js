function geourlOptionsInit() {
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	
	if(preferencesService.prefHasUserValue("geourl.destinations.count")) {
		var list = document.getElementById("geourl-options-list");
		var count = preferencesService.getIntPref('geourl.destinations.count');
		var preferred = preferencesService.getIntPref('geourl.destinations.preferred');
		var i, listitem,cell;
		for (i=1; i<=count; i++) {
			var label = preferencesService.getCharPref('geourl.destinations.'+i+'.label');
			listitem  = document.createElement("listitem");
			cell  = document.createElement("listcell");
			cell.setAttribute('label',label);
			listitem.appendChild(cell);
			list.appendChild(listitem);
			if (i==preferred) {
				list.selectItem(listitem);
			}
		}
	}
}

function geourlOptionsSetPreferred() {
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	var list = document.getElementById("geourl-options-list");
	var preferred = list.selectedIndex+1;
	preferencesService.setIntPref("geourl.destinations.preferred", preferred);
}