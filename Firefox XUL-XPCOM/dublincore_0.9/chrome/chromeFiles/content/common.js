// dublincore 0.5
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - March 2005 / Revised December 2006

// now i explicitly declare the official elements and element-refinements ... as this extension only shows *official*/*valid* DCMI stuff
// see http://www.dublincore.org/documents/dcmi-terms/ for detailed descriptions
// and http://www.dublincore.org/documents/usageguide/qualifiers.shtml (thanks to Andy Mabbett)
var dcElements = new Array(
'accrualMethod',
'accrualPeriodicity',
'accrualPolicy',
'audience',
'audience.educationLevel',
'audience.mediator',
'contributor',
'coverage',
'coverage.spatial',
'coverage.temporal',
'creator',
'date',
'date.available',
'date.created',
'date.dateAccepted',
'date.dateCopyrighted',
'date.dateSubmitted',
'date.issued',
'date.modified',
'date.valid',
'description',
'description.abstract',
'description.tableOfContents',
'format',
'format.extent',
'format.medium',
'identifier',
'identifier.bibliographicCitation',
'instructionalMethod',
'language',
'provenance',
'publisher',
'relation',
'relation.conformsTo',
'relation.hasFormat',
'relation.hasPart',
'relation.hasVersion',
'relation.isFormatOf',
'relation.isPartOf',
'relation.isReferencedBy',
'relation.isReplacedBy',
'relation.isRequiredBy',
'relation.isVersionOf',
'relation.references',
'relation.replaces',
'relation.requires',
'rights',
'rights.accessRights',
'rights.license',
'rightsHolder',
'source',
'subject',
'title',
'title.alternative',
'type'
);

var dcElementTerms = new Array('abstract','accessRights','alternative','audience','available','bibliographicCitation','conformsTo','created','dateAccepted','dateCopyrighted','dateSubmitted','educationLevel','extent','hasFormat','hasPart','hasVersion','isFormatOf','isPartOf','isReferencedBy','isReplacedBy','isRequiredBy','issued','isVersionOf','license','mediator','medium','modified','provenance','references','replaces','requires','rightsHolder','spatial','tableOfContents','temporal','valid');


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
						if (tempArray[k]==prefix+compare[j].toLowerCase()) {
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