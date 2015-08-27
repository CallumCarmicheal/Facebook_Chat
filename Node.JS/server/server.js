console.info("Facebook_Like_Chat instance has been started");
console.info("Creating variables");

var app                 = require('express')();
var http                = require('http').Server(app);
var io                  = require('socket.io')(http);
var express             = require("express");
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

console.info("Initialising our modules"); {
    setBinding();
    webServer.addFolder("/", "../public")
} console.info("Loaded our modules");


function setBinding() {
    var bindObjects         = {
        'WEB.Server': webServer,
        'CHAT.Server': authServer,
        'AUTH.Server': authServer,
        'SOCKET.Server': socketServer,
        'APP.Instance': app,
        'APP.Http': http,
        'APP.SOCKET.IO': io,
        'APP.EXPRESS': express,
        'APP.DEBUG': debugMode
    };
    
    webServer.setBinding(bindObjects);
    chatServer.setBinding(bindObjects);
    authServer.setBinding(bindObjects);
    socketServer.setBinding(bindObjects);
}

module.exports = { 
    rebindObjects : function() {
        setBinding();
    }
};