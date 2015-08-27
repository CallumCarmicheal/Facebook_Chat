var bindObjects;

// For imports, to get the functions in another file
module.exports = {
    init : function(binds){
        bindObjects = binds;
        console.log("ChatServer - Binding Sockets");
        console.log("ChatServer - Loaded");
    },
  
    sendMessage : function(userid, usertoken, chatid, message) {
        chatSendMessage(userid, usertoken, chatid, message);
    }, 
    
    setBinding : function(binds) { 
        bindObjects = binds; 
    }
};


function chatSendMessage(userID, userTOKEN, chatID, Message) {  }
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
    var userTO = queryData['MESSAGE.TO'];
    var messageSTR = queryData['MESSAGE.STR'];
    var userFrom = queryData['AUTH.FROM'];
    var hashSTR = queryData['AUTH.HASH'];
    
    var sendData = {
        'MESSAGE.FROM': userFrom,
        'MESSAGE.STR': messageSTR,
    }
    
    var validUser = false; validUser = binds['AUTH.Server'].validLoginHASH(userFrom, hashSTR);
    var IO = binds['APP.SOCKET.IO'];
    
    if(validUser == true) {
        IO.emit('something', sendData);
        console.out("onUserMessageSent (User[" + userFrom + "], To[" + userTO + "], From[" + userFrom + "])");
    }
}

function getChatHistory(queryData) { }

function chatDeleteMessage(queryData) { }