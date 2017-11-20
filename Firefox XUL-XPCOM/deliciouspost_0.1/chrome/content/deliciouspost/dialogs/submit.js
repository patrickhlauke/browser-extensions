// del.icio.us post 0.1
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - January 2005

// global variables

var delicious_post_stringbundle

function delicious_post_dialog_init() {
	
	var username='';
	var password='';
	
    const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");

	if ((preferencesService.prefHasUserValue('delicious.post.username'))&&(preferencesService.prefHasUserValue('delicious.post.password'))) {
		var username=preferencesService.getCharPref('delicious.post.username');
		if ((preferencesService.prefHasUserValue('delicious.post.password_save'))&&(preferencesService.getBoolPref('delicious.post.password_save')==true)) {
			var password=preferencesService.getCharPref('delicious.post.password');
			document.getElementById('delicious-post-dialog-password_save').setAttribute('checked',true);
		}
	}

	var description=window.opener.content.document.title;
	var url=window.arguments[0]; // this is passed to the dialog by the delicious_post_submit() function in context.js
	
	// set the values in the dialog
	document.getElementById('delicious-post-dialog-username').setAttribute('value',username);
	document.getElementById('delicious-post-dialog-password').setAttribute('value',password);
	document.getElementById('delicious-post-dialog-url').setAttribute('value',url);
	document.getElementById('delicious-post-dialog-description').setAttribute('value',description);
}

function delicious_post_dialog_accept() {
	// general stuff
	var api_url='http://del.icio.us/api/';
	var bundle=document.getElementById('delicious-post-stringbundle');

	// temporarily disable accept/cancel buttons and show the progressmeter deck (so user knows something's happening)
	document.getElementById('delicious-post-dialog-deck').selectedIndex=2;
	document.getElementById('delicios-post-dialog-accept').disabled=true;
	document.getElementById('delicios-post-dialog-cancel').disabled=true;

	// get values entered in the form
	var username=escape(document.getElementById('delicious-post-dialog-username').value);
	var password=escape(document.getElementById('delicious-post-dialog-password').value);
	var url=escape(document.getElementById('delicious-post-dialog-url').value);
	var description=escape(document.getElementById('delicious-post-dialog-description').value);
	var extended=escape(document.getElementById('delicious-post-dialog-extended').value);
	var tags=escape(document.getElementById('delicious-post-dialog-tags').value);

	// handle the login saving stuff first
    const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");

	preferencesService.setCharPref('delicious.post.username',username);

	if (document.getElementById('delicious-post-dialog-password_save').checked==true) {
		preferencesService.setCharPref('delicious.post.password',password);
		preferencesService.setBoolPref('delicious.post.password_save',true);
	} else {
		preferencesService.setCharPref('delicious.post.password','');
		preferencesService.setBoolPref('delicious.post.password_save',false);
	}

	// minimal sanity check
	if ((username=='')||(password=='')) {
		alert(bundle.getString('supplylogin'));
		document.getElementById('delicious-post-dialog-tabbox').selectedIndex=1;
		return false;
	}

	// work out the correct ISO datestamp
	var d = new Date();
	var isodatestamp = delicious_post_pad0(d.getUTCFullYear(),4)+'-'+delicious_post_pad0((d.getUTCMonth()+1),2)+'-'+delicious_post_pad0(d.getUTCDate(),2)+'T'+delicious_post_pad0(d.getUTCHours(),2)+':'+delicious_post_pad0(d.getUTCMinutes(),2)+':'+delicious_post_pad0(d.getUTCSeconds(),2)+'Z';

	// build the entire query string
	var querystring = api_url+'posts/add?url='+url+'&description='+description+'&extended='+extended+'&tags='+tags+'&dt='+isodatestamp;
	
	// start a new XMLHttpRequest 
	var xmlhttp = new XMLHttpRequest();

	// open the connection as synchronous, sending username/password as part of the HTTPAuth
	xmlhttp.open("GET",querystring,false,username,password);
	
	// send the actual request
	xmlhttp.send(null);
	
	// alert the user
	var message='';
	
	// handle reply from del.icio.us
	var status=false;	
	
	switch(xmlhttp.status) {
		case 503:
			alert(bundle.getString('statusthrottled'));
			break;
		case 401:
		case 403:
			alert(bundle.getString('statusauthenticationfailed'));
			document.getElementById('delicious-post-dialog-tabbox').selectedIndex=1;
			break;
		case 200:
			status=true;
			break;
	}
	
	// re-enable accept/cancel buttons (in case of error, they're still needed) and show normal deck
	document.getElementById('delicious-post-dialog-deck').selectedIndex=1;
	document.getElementById('delicios-post-dialog-accept').disabled=false;
	document.getElementById('delicios-post-dialog-cancel').disabled=false;
	
	// clean up - destroy created instances
	delete d;
	delete xmlhttp;
	
	return status;
}

// helper function to pad numbers to required length (http://www.propix.hu/www/Clock/Clock.html)
function delicious_post_pad0(string, newlength) {
  var pad = '';
  var len = newlength-String(string).length;
  var i;
  for (i = 0; i<len; i++) {
    pad += '0';
  }
  return pad+string;
}