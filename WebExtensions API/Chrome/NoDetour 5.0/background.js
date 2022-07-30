/* ***********************************************
NoDetour
Changes links passed through redirection scripts to
point straight to the final URL.

Patrick H. Lauke / splintered.co.uk
Recoded 30.07.2022
*********************************************** */

function nodetour() {
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

chrome.action.onClicked.addListener((tab) => {
  if(!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: nodetour
    });
  }
});