// del.icio.us post 0.5
// Created by Patrick H. Lauke aka redux - http://www.splintered.co.uk - April 2005 / Revised December 2005

// global variables

var delicious_post_stringbundle;

function delicious_post_dialog_init() {
	
	var username='';
	var password='';
	
    const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");

	if (preferencesService.prefHasUserValue('delicious.post.username')) {
		var username=preferencesService.getCharPref('delicious.post.username');
		if (preferencesService.getBoolPref('delicious.post.use_password_manager')==true) {
			password = delicious_getPassword(username);
			document.getElementById('delicious-post-dialog-password').setAttribute('value',password);
			document.getElementById('delicious-post-dialog-use_password_manager').setAttribute('checked',true);
		}
	}

	var description=window.arguments[1]; // this is passed to the dialog by the delicious_post_submit() function in context.js
	var url=window.arguments[0]; 
	
	// set the values in the dialog
	document.getElementById('delicious-post-dialog-username').setAttribute('value',username);
	document.getElementById('delicious-post-dialog-url').setAttribute('value',url);
	document.getElementById('delicious-post-dialog-description').setAttribute('value',description);
}

function delicious_post_dialog_accept() {
	delicious_postDialog();
	
	// general stuff
	var api_url='http://del.icio.us/api/';
	var bundle=document.getElementById('delicious-post-stringbundle');
	
	// get values entered in the form
	var username=encodeURIComponent(document.getElementById('delicious-post-dialog-username').value);
	var password=encodeURIComponent(document.getElementById('delicious-post-dialog-password').value);
	var url=encodeURIComponent(document.getElementById('delicious-post-dialog-url').value);
	var description=encodeURIComponent(document.getElementById('delicious-post-dialog-description').value);
	var extended=encodeURIComponent(document.getElementById('delicious-post-dialog-extended').value);
	var tags=encodeURIComponent(document.getElementById('delicious-post-dialog-tags').value);

	// handle the login saving stuff first
    const preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	preferencesService.setCharPref('delicious.post.username',username);
	if (document.getElementById('delicious-post-dialog-use_password_manager').checked==true) {
		delicious_savePassword(username,password,true);
		preferencesService.setBoolPref('delicious.post.use_password_manager',true);
	} else {
		delicious_savePassword(username,'',false);
		preferencesService.setBoolPref('delicious.post.use_password_manager',false);
	}

	// minimal sanity check
	if ((username=='')||(password=='')) {
		delicious_resetDialog(1);
		alert(bundle.getString('supplylogin'));
		return false;
	} else {

		// work out the correct ISO datestamp (no need for timezone offset, we're using UTC throughout)
		var d = new Date();
		var isodatestamp = delicious_post_pad0(d.getUTCFullYear(),4)+'-'+delicious_post_pad0((d.getUTCMonth()+1),2)+'-'+delicious_post_pad0(d.getUTCDate(),2)+'T'+delicious_post_pad0(d.getUTCHours(),2)+':'+delicious_post_pad0(d.getUTCMinutes(),2)+':'+delicious_post_pad0(d.getUTCSeconds(),2)+'Z';
		// clean up - destroy created instance (necessary?)
		delete d;
		
		// build the entire query string
		var querystring = api_url+'posts/add?url='+url+'&description='+description+'&extended='+extended+'&tags='+tags+'&dt='+isodatestamp;
		
		// start a new XMLHttpRequest 
		var xmlhttp = new XMLHttpRequest();
	
		// open the connection as synchronous, sending username/password as part of the HTTPAuth
		xmlhttp.open('GET',querystring,false,username,password);
	
		// send the actual request
		try {
			xmlhttp.send(null);
		} catch(e) {
			delicious_resetDialog(0);
			alert(bundle.getString('statusconnectionerror'));
			return false;
		}
		try {
			switch(xmlhttp.status) {
				case 503:
					delicious_resetDialog(0);
					alert(bundle.getString('statusthrottled'));
					return false;
				case 401:
				case 403:
					delicious_resetDialog(1);
					alert(bundle.getString('statusauthenticationfailed'));
					return false;
				case 200:
					delicious_resetDialog(0);
					return true;
				default:
					delicious_resetDialog(0);
					return false;
			}
		} catch (e) {
			delicious_resetDialog(0);
			alert(bundle.getString('statusconnectionerror'));
			return false;
		}
	}
}

function delicious_autofillPassword(username) {
	if (document.getElementById('delicious-post-dialog-use_password_manager').checked==true) {
		var password = delicious_getPassword(username);
		document.getElementById('delicious-post-dialog-password').setAttribute('value',password);
	}
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

function delicious_savePassword(username,password,save) {
  var url = 'chrome://deliciouspost/';

  var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance();

  if (passwordManager) {
    passwordManager = passwordManager.QueryInterface(Components.interfaces.nsIPasswordManager);
	if (save) {
		try{
		  passwordManager.addUser(url, username, password);
		} catch (e) { }
	} else {
		try{
		  passwordManager.removeUser(url, username);
		} catch (e) { }
	}	
  }
}

function delicious_getPassword(username) {
  var url = 'chrome://deliciouspost/';

  var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance(Components.interfaces.nsIPasswordManagerInternal);
  var host = {value:''};
  var user =  {value:''};
  var password = {value:''}; 

  try {
    passwordManager.findPasswordEntry(url, username, '', host, user, password);
  } catch(e){ }

  return password.value;
}

function delicious_postDialog() {	
	// temporarily disable accept/cancel buttons and show the progressmeter deck (so user knows something's happening)
	document.getElementById('delicious-post-dialog').setAttribute('wait-cursor',true);
	document.getElementById('delicious-post-dialog-accept').setAttribute('disabled',true);
}

function delicious_resetDialog(index) {
	document.getElementById('delicious-post-dialog').removeAttribute('wait-cursor');
	document.getElementById('delicious-post-dialog-accept').setAttribute('disabled',false);
	document.getElementById('delicious-post-dialog-tabbox').setAttribute('selectedIndex',index);
}