/* ***********************************************
DeARIAfy

Removes any role='...' and aria-*='...' attributes. Last resort when sites use broken/incorrect ARIA.

Patrick H. Lauke / splintered.co.uk
February 2019
*********************************************** */

function onExtensionMessage(request) {
	if (request['go'] != undefined) {
		if (!document.hasFocus()) {
			return;
		}
		var attributes = ["role","aria-activedescendant","aria-atomic","aria-autocomplete","aria-busy","aria-checked","aria-colcount","aria-colindex","aria-colspan","aria-controls","aria-current","aria-describedby","aria-details","aria-disabled","aria-dropeffect","aria-errormessage","aria-expanded","aria-flowto","aria-grabbed","aria-haspopup","aria-hidden","aria-invalid","aria-keyshortcuts","aria-label","aria-labelledby","aria-level","aria-live","aria-modal","aria-multiline","aria-multiselectable","aria-orientation","aria-owns","aria-placeholder","aria-posinset","aria-pressed","aria-readonly","aria-relevant","aria-required","aria-roledescription","aria-rowcount","aria-rowindex","aria-rowspan","aria-selected","aria-setsize","aria-sort","aria-valuemax","aria-valuemin","aria-valuenow","aria-valuetext"];
		var elements=document.querySelectorAll('*');
		for(var i=0;i<elements.length;i++) {
			if (elements[i].hasAttributes()) {
				var attrs = elements[i].attributes;
				for(var j=0;j<attrs.length;j++) {
					if (attributes.includes(attrs[j].name)) {
						elements[i].removeAttribute(attrs[j].name);
					}
				}
			}
		}
	}
}

function initContentScript() {
	chrome.extension.onRequest.addListener(onExtensionMessage);
}

initContentScript();