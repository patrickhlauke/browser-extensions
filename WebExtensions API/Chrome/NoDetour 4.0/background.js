/* ***********************************************
Adapted from Presto-based No Detour 3.0 extension
Patrick H. Lauke / splintered.co.uk
August 2013

Code liberally stolen and repurposed from
http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/extensions/speak_selection/
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