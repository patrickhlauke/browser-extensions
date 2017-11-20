// functionality based on "link neutraliser" bookmarklet
// http://www.splintered.co.uk/experiments/48/

// wait for event fired by UI button
opera.extension.onmessage = function(event) {
	if (event.data === 'go') {
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
};