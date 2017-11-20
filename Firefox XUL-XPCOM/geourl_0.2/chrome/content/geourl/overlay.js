// GeoURL 0.2
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - March 2005

// global variables
var gGeourlLat;
var gGeourlLong;

// change toolbar and status bar button status (enabled/disabled) based on presence of relevant META elements
function geourlChangeState() {
	var regexp_clean = new RegExp('[^0-9;,.-]', "g");
	var tbutton = document.getElementById("geourl-toolbarbutton");
	var sbutton = document.getElementById("geourl-statusbarbutton");
	if (tbutton) tbutton.disabled = true;
	sbutton.disabled = true;
	var metas = window.content.document.getElementsByTagName("META");
	if (metas) {
		for (i=0; i < metas.length; i++) {
			metas[i].name=metas[i].name.toLowerCase();
			if ((metas[i].name=='icbm')||(metas[i].name=='geo.position')) {
				if (tbutton) tbutton.disabled = false;
				sbutton.disabled = false;
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

// open new tab with found geo position
function geourlNear() {
	var destination = 'http://geourl.org/near?lat='+gGeourlLat+'&long='+gGeourlLong;
    const newTab = getBrowser().addTab(destination);
	getBrowser().selectedTab = newTab;
}


// add listeners to various necessary parts of the browser, to handle page load/unload and tab switching
function geourlInit(e) {
    var contentArea = document.getElementById("appcontent");
    contentArea.addEventListener("select", geourlChangeState, false);
    contentArea.addEventListener("unload", geourlChangeState, true);
    contentArea.addEventListener("load", geourlChangeState, true);
}

// initialise geourl extension when browser first loaded
window.addEventListener("load", geourlInit, false);