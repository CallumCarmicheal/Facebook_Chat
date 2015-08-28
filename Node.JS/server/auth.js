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
    
    validUsername : function(username) {
        return authValidUsername(username);
    },
    
    validCreditentials : function(username, password) {
        return authValidCreditentials(username, password);
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
    
    validLogin : function(username, loginHASH) {
        return authValidLogin(username, loginHASH);
    }
};



function authValidUsername(username) { 
    if(username == "SomeUsernameHere") {
        return true;
    }
    
    return false; 
}
 
function authValidCreditentials(username, password) { 
    return false; 
}
 
function authGetAccount(accountName) { 
    var userData = {
        'userIndex': 0,
        'username': "",
        'loginHASH': [ '' ], // Array because an account can have many logins
        'email': '',
        'friends': [ '' ],
        'groupChats': [ '' ] 
    }
        
    return userData;
}

function authValidHASH(strHash) {
    if(strHash == "4PzyPedgzOfKZrY5cIb7") {
        return true;
    }
    
    return false;
}
 
function authValidLogin(username, loginHASH) {
    if(authValidUsername(username)) {
        if(authValidHASH(loginHASH)) {
            return true;
        }
    }
    
    return false;
}