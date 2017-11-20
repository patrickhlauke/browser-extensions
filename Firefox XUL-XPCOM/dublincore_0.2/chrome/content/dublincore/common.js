// dublincore 0.2
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - March 2005 / Revised December 2005

// now i explicitly declare the official elements and element-refinements ... as this extension only shows *official*/*valid* DCMI stuff
// see http://www.dublincore.org/documents/dcmi-terms/ for detailed descriptions
var dcElements = new Array('title','creator','subject','description','publisher','contributor','date','type','format','identifier','source','language','relation','coverage','rights');
var dcElementTerms = new Array('abstract','accessrights','alternative','audience','available','bibliographiccitation','conformsto','created','dateaccepted','datecopyrighted','datesubmitted','educationlevel','extent','hasformat','haspart','hasversion','isformatof','ispartof','isreferencedby','isreplacedby','isrequiredby','issued','isversionof','license','mediator','medium','modified','provenance','references','replaces','requires','rightsholder','spatial','tableofcontents','temporal','valid');


// fairly ad-hoc, kludged helper function - depending on whether treeview is set or not, it either returns at the first sign of a piece of DC metadata, or adds a row to a tree and continues the crawl
function dc_crawler(what,attributeelement,attributecontent,compare,prefix,treeview) {
	var counter;
	var tempArray = new Array;
	if(what) {
		for (var i=0; i < what.length; i++) {
			if (what[i].getAttribute(attributeelement)) {
				what[i].setAttribute(attributeelement,what[i].getAttribute(attributeelement).toLowerCase());
				tempArray = what[i].getAttribute(attributeelement).split(' '); // split each space-separated element name (e.g. multiple link rels)
				for (var k=0; k < tempArray.length; k++) {
					for (var j=0; j < compare.length; j++) {
						if (tempArray[k]==prefix+compare[j]) {
							if (treeview) {
								treeview.addRow([compare[j],what[i].getAttribute(attributecontent),what[i].getAttribute('scheme')]);		
								counter++;
							} else {
								return true;
							}
						}
					}
				}
			}
		}
	}
	if (treeview) {
		treeview.rowCountChanged(0,counter);
		return true;
	} else {
		return false;
	}
}