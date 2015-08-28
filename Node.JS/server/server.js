console.info("Facebook_Like_Chat instance has been started");
console.info("Creating variables");

var app                 = require('express')();
var http                = require('http').Server(app);
var io                  = require('socket.io')(http);
var express             = require("express");
var jsonWeb             = require('jsonwebtoken');
var authServer          = require("./auth");
var chatServer          = require("./chat");
var webServer           = require("./web");
var socketServer        = require("./sockets");
var debugMode           = true;
var serverPort          = 8080;

console.info("Starting server"); 
http.listen(serverPort, function(){
    console.info("Started server on *:" + serverPort);
});

// Attention Viewers, Yu has went AFK to eat his dinner . 
// He will come back soon, so stay for a-bit and you will
// have your long awaited japanese man to greet You !!!!!
// - CallumC

console.info("Initialising our modules"); {
    setBinding(true);
    webServer.addFolder("/", "../public")
} console.info("Loaded our modules");


function setBinding(callInit) {
    var bindObjects         = {
        'WEB.Server': webServer,
        'CHAT.Server': chatServer,
        'AUTH.Server': authServer,
        'SOCKET.Server': socketServer,
        'JSON.WEB.Tokens': jsonWeb,
        'APP.Instance': app,
        'APP.Http': http,
        'APP.SOCKET.IO': io,
        'APP.EXPRESS': express,
        'APP.DEBUG': debugMode
    };
    
    if(callInit) {
        webServer.init(bindObjects);
        chatServer.init(bindObjects);
        authServer.init(bindObjects);
        socketServer.init(bindObjects);
    } else {
        webServer.setBinding(bindObjects);
        chatServer.setBinding(bindObjects);
        authServer.setBinding(bindObjects);
        socketServer.setBinding(bindObjects);
    }
}

module.exports = { 
    rebindObjects : function() {
        setBinding(false);
    }
};