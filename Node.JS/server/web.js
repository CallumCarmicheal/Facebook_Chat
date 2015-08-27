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
    
    addFile : function(webLocation, fileLocation){
        
    },
    
    addFolder : function(webLocation, folderLocation) {
        bindObjects['APP.Instance'].use(webLocation, bindObjects['APP.EXPRESS'].static(folderLocation));
        console.log("WebServer - Created Folder Instance (" + webLocation + " | " + folderLocation + ")");
    }
};