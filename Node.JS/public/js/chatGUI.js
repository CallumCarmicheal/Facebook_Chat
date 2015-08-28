//this function can remove a array element.
Array.remove = function(array, from, to) {
	var rest = array.slice((to || from) + 1 || array.length);
	array.length = from < 0 ? array.length + from : from;
	return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

//arrays of popups ids
var popups = [];

//our Sockets
var socketIO;

//this is used to close a popup
function close_popup(id) {
	for (var iii = 0; iii < popups.length; iii++) {
		if (id == popups[iii]) {
			Array.remove(popups, iii);
			document.getElementById(id).style.display = "none";
			calculate_popups();
			return;
		}
	}
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups() {
	var right = 220;

	var iii = 0;
	for (iii; iii < total_popups; iii++) {
		if (popups[iii] != undefined) {
			var element = document.getElementById(popups[iii]);
			element.style.right = right + "px";
			right = right + 320;
			element.style.display = "block";
		}
	}

	for (var jjj = iii; jjj < popups.length; jjj++) {
		var element = document.getElementById(popups[jjj]);
		element.style.display = "none";
	}
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(id, name) {

	for (var iii = 0; iii < popups.length; iii++) {
		//already registered. Bring it to front.
		if (id == popups[iii]) {
			Array.remove(popups, iii);
			popups.unshift(id);
			calculate_popups();
			
			return;
		}
	}
	
	var SPAM = true;
	var tempMessage = "Hello, how are you.";
	if(name == "先輩") { tempMessage = "こんにちは星野-先輩"; }
	var message = "<serverText> User " + name + ' </serverText><br><div class="messageTextDIV"><messageText>' + tempMessage + '</messageText></div> <br>';
	
	if(SPAM) {
		var iterations = 4;
		for (var i = 0; i < iterations; i++) {
		  message += message;
		}
	}

	var element = '<div class="popup-box chat-popup" id="' + id + '">';
	element = element + '<div class="popup-head">';
	element = element + '<div class="popup-head-left">' + name + '</div>';
	element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\'' + id + '\');">&#10005;</a></div>';
	element = element + `
		<div style="clear: both"></div></div>
		<div class="popup-messages" style="overflow:hidden;"> 
			<div id="chat_User:` + name + `" style="height: 80%;overflow: auto;width:100%;">` + message + `</div> 
			<div style="bottom:0px;height:20%;width:100%;"><textarea style="width:100%;height:47%;" onkeydown="if(event.keyCode == 13) {sendChatMessage(` + name + `);}" name="chat_Text:` + name + `"></textarea></div>
		</div>
	`; // So why is the textarea not going at full width
	
	document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;
	popups.unshift(id);
	calculate_popups();
}

function sendChatMessage(to, from, message, loginHASH) {
	var data = { 
		'MESSAGE.TO': to,
		'MESSAGE.STR': message,
		'AUTH.FROM': from,
		'AUTH.HASH': loginHASH
	}
	
	socketIO.emit('chat message send', data);
}

function setupIO() {
	
	var userData = {
		'userName': getCookie("userName"),
		'loginHASH': getCookie("loginHASH")
	};
	
	socketIO = io.connect('' , { 
		query: 'joinServerParameters=' + JSON.stringify(userData) ,
		'force new connection': true
	});
	
	socketIO.on('error', function (errorData) { 
		console.log(errorData);
		if(errorData=="Authentication error") { } 
	});
	socketIO.on('connect', function () { console.log("Connected to Chat Server") });
	
	socketIO.on('auth validated', function () {
		console.log('Logged into Authentication');
	});
}

function createTestDATA() {
	setCookie("userName", "SomeUsernameHere", 1);
	setCookie("loginHASH", "4PzyPedgzOfKZrY5cIb7", 1);
	console.log("Created test Data");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
    console.log("Creating cookie(" + cname + ", " + cvalue + ", " + exdays + ")");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
        	var data = c.substring(name.length,c.length);
        	console.log("Reading Cookie(" + cname + ") <-- " + data);
        	return data;
        }
    }
    return "";
}

function connectToServer (token) {
  var socket = io.connect('', {
    query: 'loginHASH=' + token
  });

  socket.on('auth validated', function () {
    console.log('authenticated');
  }).on('auth disconnected', function () {
    console.log('disconnected');
  });
}

function scrollToBottom(username) {
	var id = ("chat_User:" + username);
	var arr = document.getElementsByTagName("*");
	var len = arr.length;
	for ( var i = 0; i < len; i++ ) {
    if ( arr[i].id.indexOf( id ) === 0 )
      var obj = arr[i];
      obj.scrollTop = obj.scrollHeight; 
  	}
}

//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups() {
	var width = window.innerWidth;
	if (width < 540) {
		total_popups = 0;
	} else {
		width = width - 200;
		//320 is width of a single popup box
		total_popups = parseInt(width / 320);
	}

	display_popups();
}

function addChat(username) {
	var e = document.createElement('div');
	element.appendChild(e.firstChild);
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);