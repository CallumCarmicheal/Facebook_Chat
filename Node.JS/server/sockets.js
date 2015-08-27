var bindObjects;
var clients = []; // Uses loginHASH

// For imports, to get the functions in another file
module.exports = {
    init : function(binds) {
        bindObjects = binds;
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

function onSocketConnect(socket) {
	
}