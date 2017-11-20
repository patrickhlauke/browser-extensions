/* ***********************************************
Adapted from Presto-based No Detour 3.0 extension
Patrick H. Lauke / splintered.co.uk
August 2013

Code liberally stolen and repurposed from
http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/extensions/speak_selection/
*********************************************** */

function onExtensionMessage(request) {
	if (request['go'] != undefined) {
		if (!document.hasFocus()) {
			return;
		}
		var elements=document.getElementsByTagName('a');
		var n_elements=elements.length;
		var re = new RegExp('\.(https?):?/{1,}([^&]+)\\b');
		for(i=0;i<n_elements;i++) {
			var m=re.exec(decodeURIComponent(elements[i].href));
			if (m!=null) {
				if (m.length>2) { 
					elements[i].href = m[1]+'://'+m[2];
				}
			}
		}
	}
}

function initContentScript() {
	chrome.extension.onRequest.addListener(onExtensionMessage);
}

initContentScript();