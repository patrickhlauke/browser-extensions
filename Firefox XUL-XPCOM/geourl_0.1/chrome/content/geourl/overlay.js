// GeoURL 0.1
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - March 2005

// change toolbar button status (enabled/disabled) based on presence of relevant META elements
function geourlChangeState() {
	var regexp_clean = new RegExp('[^0-9;,.-]', "g");
	var button = document.getElementById("geourl-toolbarbutton");
	button.disabled = true;
	var metas = window.content.document.getElementsByTagName("META");
	if (metas) {
		for (i=0; i < metas.length; i++) {
			if ((metas[i].name=='ICBM')||(metas[i].name=='geo.position')) {
				button.disabled = false;
				var value = metas[i].content;
				value = value.replace(regexp_clean,'');
				value = value.replace(';',',');
				button.geourlvalue = value;
				var coordinates = value.split(',');
				button.geourlvaluelat=coordinates[0];
				button.geourlvaluelong=coordinates[1];
				// alert('ICBM META found: '+metas[i].content);
				
			}
		}
	}
}

// open new tab with found geo position
function geourlNear() {
	var button = document.getElementById("geourl-toolbarbutton");
	var destination = 'http://geourl.org/near?lat='+button.geourlvaluelat+'&long='+button.geourlvaluelong;
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