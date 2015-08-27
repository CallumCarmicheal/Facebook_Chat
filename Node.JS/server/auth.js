var bindObjects;

// For imports, to get the functions in another file
module.exports = {
    init : function(binds) {
        bindObjects = binds;
        console.log("WebServer - Loaded");
    },
    
    setBinding : function(binds) { 
        bindObjects = binds; 
    },
    
    validUsername : function(username, loginHash) {
        return false;
    },
    
    validCreditentials : function(username, password) {
        return false;
    },
    
    getAccount : function(accountName) { // Account id or name, maybe the id given for userIndex?
        var userData = {
            'userIndex': 0,
            'username': "",
            'loginHASH': [ '' ], // Array because an account can have many logins
            'email': '',
            'friends': [ '' ],
            'groupChats': [ '' ] 
        }
        
        return userData;
    },
    
    validLoginHASH : function(username, loginHASH) {
        return false;
    }
};