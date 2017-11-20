// dublincore 0.1
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - March 2005

// uses helper functions and globals from chrome://dublincore/content/common.js and chrome://dublincore/content/windows/treeview.js

// globals
var metaView, metaTree;

function dublincore_window_init() {
	metaView = new pageInfoTreeView(["meta-name","meta-content","meta-scheme"],1);
	metaTree = document.getElementById("dublincore-tree");
	metaTree.treeBoxObject.view = metaView;
	
	// crawl META elements
	var metas=window.opener.content.document.getElementsByTagName("meta");
	dc_crawler(metas,'name','content',dcElements,'dc.',metaView);
	dc_crawler(metas,'name','content',dcElementTerms,'dcterms.',metaView);
	
	// crawl LINK elements
	var links=window.opener.content.document.getElementsByTagName("link");
	dc_crawler(links,'rel','href',dcElements,'dc.',metaView);
	dc_crawler(links,'rel','href',dcElementTerms,'dcterms.',metaView);
}

// when a selection is made in the tree, show the content in the textbox at the bottom - works nicely for long descriptions and such
function dublincore_detail() {
	var content=metaView.getCellText(metaTree.currentIndex,"meta-content");
	var detail=document.getElementById("dublincore-detail-view");
	detail.value=content;
}