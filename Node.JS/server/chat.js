var bindObjects;

// For imports, to get the functions in another file
module.exports = {
    init : function(binds){
        bindObjects = binds;
        console.log("ChatServer - Binding Sockets");
        console.log("ChatServer - Loaded");
    },
  
    sendMessage : function(chatData) {
        chatSendMessage(chatData);
    }, 
    
    setBinding : function(binds) { 
        bindObjects = binds; 
    }
};


function chatSendMessage(data) {
    var from = data.to;
    var to = data.from;
	var message = data.message;
	var time = data.time;
	var data = getServer().getSocketData(to);
	var sendData = { 'from': from, 'message': message, 'time': time }
	
	
	if(data == false) {
	    console.log("Could not get socket");
	} else {
	    data.Socket.emit('chat message recieve', sendData);
	    console.log("Sending Chat Message : ([" + time + "]" + from + " --> " + to + "[" + data.Username + "] : " + message + ")");
	}
}

function chatReadHistory(userID, userTOKEN, chatID, Message) { return null; }

function chatHandler(socket) {
    socket.on('chat message send', function(data) {
        onMessageSent(data);
    });
    
    socket.on('chat get history', function(data) {
        getChatHistory(data);
    });
}

function onMessageSent(queryData) {
    
}

function getChatHistory(queryData) { }

function chatDeleteMessage(queryData) { }

function getServer() {
    return bindObjects['SOCKET.Server'];
}