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

//our Sockets and Auth info
var socketIO;
var loginTries = 0;

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
			<div style="bottom:0px;height:20%;width:100%;"><textarea style="width:100%;height:47%;resize: none;" onkeydown="if(event.keyCode == 13) {sendChatMessage(` + name + `);}" id="chat_Text:` + name + `"></textarea></div>
		</div>
	`; // So why is the textarea not going at full width
	
	document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;
	popups.unshift(id);
	calculate_popups();
}

function addFriendToList(userData) {
	
	var element = 			`<div class="sidebar-name">`;
	element 	= element + `<a href="javascript:register_popup('` + userData.username + `', '` + userData.fullname + `');">`;
    element 	= element + `<img width="30" height="30" src="img/icon_user.png" />`;
    element 	= element + `<span>` + userData.fullname + `</span>`;
    element 	= element + `</a>`;
    element 	= element + `</div>`;
    
    var userList = document.getElementById("friends_USERLIST");
    userList.innerHTML = userList.innerHTML + element;
}

function addFriendToListSTR(username, fullname) {
	addFriendToList({ 'username': username, 'fullname': fullname });
}

function sendChatMessage(to, from, message, loginHASH) {
	var data = { 
		'MESSAGE.TO': to,
		'MESSAGE.STR': message,
		'AUTH.FROM': from,
		'AUTH.HASH': loginHASH
	};
	
	socketIO.emit('chat message send', data);
}

function setupIO(username, loginHash) {
	
	/* var userData = {
		'userName': getCookie("userName"),
		'loginHASH': getCookie("loginHASH")
	};*/
	
	var userData = {
		'userName': username,
		'loginHASH': loginHash
	};
	
	socketIO = io.connect('' , { 
		query: 'joinServerParameters=' + JSON.stringify(userData) ,
		'force new connection': true
	});
	
	socketIO.on('error', function (errorData) { 
		console.log(errorData);
		if(errorData=="Authentication error - Invalid Username or Login-HASH") { 
			document.getElementById('friends_TITLE').innerHTML = "MESSAGES (<font color='red'>Invalid AUTH</font>)";
			updateLoginAttempts();
		} 
	});
	
	socketIO.on('connect', function () {
		addFriendToListSTR("callum_carmicheal", "Callum Carmicheal");
		addFriendToListSTR("accountUsername", "Account Full Name");
		addFriendToListSTR("先輩", "先輩");
		
		loginTries = 0;
		document.getElementById('friends_TITLE').innerHTML = "MESSAGES (<font color='green'>Connected</font>)";
		document.getElementById('login_FormBOX').innerHTML = "";
		console.log("Connected to Chat Server");
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

function getStart_onClick() {
	var divElement = document.getElementById("login_FormBOX");
	
	var element = "";
	element 	 = element + `<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">`;
    element 	 = element + `<input class="mdl-textfield__input" type="text" id="login_USERNAME"/>`;
    element 	 = element + `<label class="mdl-textfield__label" for="login_USERNAME">Username</label>`;
    element 	 = element + `</div>`;
    element 	 = element + `<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">`;
    element 	 = element + `<input class="mdl-textfield__input" type="text" id="login_PASSWORD"/>`;
    element 	 = element + `<label class="mdl-textfield__label" for="login_PASSWORD">Login Hash</label>`;
    element 	 = element + `</div> <br>`;
    element 	 = element + `<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" onclick="login_onClick();"> Login </button> <br><br>`;
    element 	 = element + `<div id="login_ATTEMPTS"><span class="mdl-badge" data-badge="0">Attempts</span></div><br>`;
    element 	 = element + `<p>! Username: SomeUsernameHere | loginHASH=4PzyPedgzOfKZrY5cIb7 !</p>`
    
    $('#login_FormBOX').html(element);
    $('#login_FormBOX').trigger("create");
}

function login_onClick() {
	var username = $('#login_USERNAME').val();
	var loginHASH = $('#login_PASSWORD').val();
	setupIO(username, loginHASH);
}

function updateLoginAttempts() {
	loginTries++;
	
	var element = document.getElementById("login_ATTEMPTS");
	element.innerHTML = '<div id="login_ATTEMPTS"><span class="mdl-badge" data-badge="' + loginTries + '">Attempts</span></div><br>';
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
