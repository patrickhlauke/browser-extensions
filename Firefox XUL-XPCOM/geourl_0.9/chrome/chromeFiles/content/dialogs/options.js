function geourlOptionsInit() {
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch('extensions.geourl.');
	var list = document.getElementById('geourl-options-list');
	var listitem, cell;
	var preferred = preferencesService.getIntPref('destinations_preferred');
	var destinations = preferencesService.getCharPref('destinations');
	var destinations_array = eval('(' + destinations + ')');
	for (var i in destinations_array) {
		var label = i;
		listitem  = document.createElement('listitem');
		cell  = document.createElement('listcell');
		cell.setAttribute('label',label);
		listitem.appendChild(cell);
		list.appendChild(listitem);
	}
	// list.selectedIndex = -1;
	// list.selectedItem = list.getItemAtIndex(preferred-1);
	// list.selectItem(list.getItemAtIndex(preferred-1));
	// list.getItemAtIndex(preferred-1).setAttribute('selected',true);
}

function geourlOptionsSetPreferred() {
	const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch('extensions.geourl.');
	var list = document.getElementById('geourl-options-list');
	var preferred = list.selectedIndex+1;
	preferencesService.setIntPref('destinations_preferred', preferred);
}