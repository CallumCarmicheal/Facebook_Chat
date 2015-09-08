var bindObjects;
var authServer;
var socketData = [];

var log_ValidConnections = true;
var log_InvalidConnections = true;
var log_GetFriendsRequest = false;

// For imports, to get the functions in another file
module.exports = {
    init : function(binds) {
        bindObjects = binds;
        authServer = bindObjects['AUTH.Server'];
        
        console.log("SocketServer - Syncing with AUTH Servers");
        initServer(bindObjects['APP.SOCKET.IO']);
        console.log("SocketServer - Loaded");
    },
    
    setBinding : function(data) {
    	bindObjects = data;
    },
    
    getSocketData : function() {
    	return socketData;
    },
    
    getSocket : function(username) {
        return getSocket(username);
    },
    
    getSocketData : function(username) {
        return getData(username);
    }
};

function initServer(io) {
    
    io.use(function(socket, next){
        var handShake = JSON.parse(socket.handshake.query.joinServerParameters);
        var username  = handShake.userName;
        var loginHASH = handShake.loginHASH;
        var loginUsed = false;
        
        if(handShake != null) {
            
            if ( authServer.validLogin(username, loginHASH) ) {
                if(loginUsed) {
                    console.log("Client Connecting (" + username + " | " + loginHASH + ") <-- Login taken");
                    next(new Error('Authentication error - Username is in use'));
                    
                    return;
                }
                
                socketData.push({
                   Username: username,
                   Socket: socket
                });
                
                socket.broadcast.emit('friends add', bindObjects['AUTH.Server'].getAccount(username));
                
                socket.on('disconnect', function(){
                    removeClientByUsername(username);
                    
                    io.emit('friends remove', bindObjects['AUTH.Server'].getAccount(username));
                    console.log("Client Disconnected (" + username + " | " + loginHASH + ")");
                });
                
                socket.on('friends get', function(data) {
                   sendFriendsToSocket(io, socket, username);
                   
                   if(log_GetFriendsRequest) { console.log("Client Requesting Friends (" + username + " | " + loginHASH + ") <-- Sent Friends"); }
                });
                
                socket.on('chat message send', function(data) {
                    var packet = data;
                    packet.from = username;
                    
                    console.info(packet);
                    bindObjects['CHAT.Server'].sendMessage(data);
                });
                
                if(log_ValidConnections) {
                    console.log("Client Connecting (" + username + " | " + loginHASH + ") <-- Connected");
                }
                
                sendFriendsToSocket(io, socket, username);
                next();
            } else {
                if(log_InvalidConnections) {
                    console.log("Client Connecting (" + username + " | " + loginHASH + ") <-- Invalid Creds");
                }
                
                next(new Error('Authentication error - Invalid Username or Login-HASH'));
            }
        }
        
        return;
    });
}

function sendChatMessage(io, data) {
    /*var data = { 
		'to': username,
		'message': message,
		'from': ""
	};*/
	
	var to = data.to;
	var message = data.message;
	var from = data.from;
	var time = data.time;
	var sendSocket = getSocket(data.from);
	
	var sendData = { 'from': from, 'message': message, 'time': time }
	
	sendSocket.emit('chat message recieve', sendData);
}

function sendFriendsToSocket(io, socket, username) {
    for( var i=0; i <= socketData.length - 1; i++){
        var data = socketData[i];
        
        if(username == data.Username) {} else {
            var account = bindObjects['AUTH.Server'].getAccount(data.Username);
		    socket.emit( 'friends add', account );
        }
	}
}

function getSocket(username) {
    for( var i=0; i <= socketData.length - 1; i++){
        var data = socketData[i];
        
        if(username == data.Username) {} else {
            return data.Socket;
        }
	}
    
    return false;
}

function getData(username) {
    for( var i=0; i <= socketData.length - 1; i++){
        var data = socketData[i];
        
        if(username == data.Username) {} else {
            return data;
        }
	}
    
    return false;
}

function removeClientBySocket() {}

function removeClientByUsername(username) {
    for( var i=0; i <= socketData.length - 1; i++ ){
        var data = socketData[i];
		
		if(data.Username == username) {
		    socketData.splice(i, 1);
		}
	}
}