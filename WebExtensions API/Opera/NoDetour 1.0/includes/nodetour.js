window.addEventListener('DOMContentLoaded',
function () {
	elements=document.querySelectorAll('a');
	n_elements=elements.length;
	var re = new RegExp('\\=http://[^&]+\\b');
	for(i=0;i<n_elements;i++) {
		var m=re.exec(decodeURIComponent(elements[i].href));
		var s='';
		if (m!=null) {
			for (j = 0; j < m.length; j++) {
				s = s + m[j] + '\n';
			}
			elements[i].href=s.substring(1, s.length);
		}
	}
},
false);