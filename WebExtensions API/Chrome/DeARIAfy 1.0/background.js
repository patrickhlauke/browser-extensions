/* ***********************************************
DeARIAfy

Removes any role='...' and aria-*='...' attributes. Last resort when sites use broken/incorrect ARIA.

Patrick H. Lauke / splintered.co.uk
February 2019
*********************************************** */

function loadContentScriptInAllTabs() {
	chrome.windows.getAll({'populate': true}, function(windows) {
		for (var i = 0; i < windows.length; i++) {
			var tabs = windows[i].tabs;
			for (var j = 0; j < tabs.length; j++) {
				chrome.tabs.executeScript(
					tabs[j].id,
					{file: 'content_script.js', allFrames: true});
			}
		}
	});
}

function initBackground() {
	loadContentScriptInAllTabs();

	chrome.browserAction.onClicked.addListener(function(tab) {
		chrome.tabs.sendRequest(
			tab.id,
			{'go': true});
	});
}

initBackground();