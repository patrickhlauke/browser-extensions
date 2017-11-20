// functionality based on "link neutraliser" bookmarklet
// http://www.splintered.co.uk/experiments/48/

// wait for event fired by UI button
opera.extension.onmessage = function(event) {
	if (event.data === 'go') {
		elements=document.querySelectorAll('a');
		n_elements=elements.length;
		opera.postError('document: '+window.location+' / found '+n_elements+' links ');
		var re = new RegExp('\\=http://[^&]+\\b');
		for(i=0;i<n_elements;i++) {
			opera.postError('+++ link '+i+': '+elements[i].href);
			var m=re.exec(decodeURIComponent(elements[i].href));
			opera.postError('decoded: '+decodeURIComponent(elements[i].href));
			var s='';
			if (m!=null) {
				for (j = 0; j < m.length; j++) {
					s = s + m[j] + '\n';
				}
				elements[i].href=s.substring(1, s.length);
				opera.postError('changed to: '+elements[i].href);
			}
		}
	}
};