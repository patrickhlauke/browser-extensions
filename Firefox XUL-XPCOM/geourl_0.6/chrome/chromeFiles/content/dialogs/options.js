function geourlOptionsInit() {
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch('extensions.geourl.');
	var preferred;
	var list = document.getElementById('geourl-options-list');
	var count = preferencesService.getIntPref('destinations_count');
	preferred = preferencesService.getIntPref('destinations_preferred');

	var i, listitem,cell;
	for (i=1; i<=count; i++) {
		var label = preferencesService.getCharPref('destinations_'+i+'_label');
		listitem  = document.createElement('listitem');
		cell  = document.createElement('listcell');
		cell.setAttribute('label',label);
		listitem.appendChild(cell);
		list.appendChild(listitem);
	}
	// list.selectItem(list.getItemAtIndex(preferred-1));
	list.getItemAtIndex(preferred-1).setAttribute('selected',true);
}

function geourlOptionsSetPreferred() {
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch('extensions.geourl.');
	var list = document.getElementById('geourl-options-list');
	var preferred = list.selectedIndex+1;
	preferencesService.setIntPref('destinations_preferred', preferred);
}