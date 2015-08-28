var bindObjects;
var authServer;
var clients = []; // Uses loginHASH

// For imports, to get the functions in another file
module.exports = {
    init : function(binds) {
        bindObjects = binds;
        authServer = bindObjects['AUTH.Server'];
        initServer(bindObjects['APP.SOCKET.IO']);
        
        console.log("SocketServer - Loaded");
    },
    
    setBinding : function(data) {
    	bindObjects = data;
    },
    
    getClients : function() {
    	return clients;
    },
    
    addClient : function(loginHASH, Username) {
    	clients[loginHASH] = Username;
    }
};

function initServer(io) {
    io.use(function(socket, next){
        var handShake = JSON.parse(socket.handshake.query.joinServerParameters);
        var username  = handShake.userName;
        var loginHASH = handShake.loginHASH;
        
        if(handShake != null) {
            
            if ( authServer.validLogin(username, loginHASH) ){
                console.log("Client Connecting (" + username + " | " + loginHASH + ") <-- Connected");
                next();
            } else {
                console.log("Client Connecting (" + username + " | " + loginHASH + ") <-- Invalid Creds");
                
                next(new Error('Authentication error - Invalid Username or Login-HASH'));
            }
        }
        
        return;
    });
}