//An array of objects defining all the runtime CLI commands
//
//{  
//  'name': commandName,
//  'argNum': numberOfArguments,
//  'code': function(args){
//    you can either call a function here
//    or
//    type your code
//  }
//}

var binds; //will hold references to functions that need to be called

/* Example commands
var commands = [
  {  
    'name': 'irc',
    'argNum': 0,
    'code': function(args){
      console.log('Hello. How are you today?');
    }
  },
  {  
    'name': 'say',
    'argNum': 1,
    'code': function(args){
      binds['API.IRC.Say'](args[0]);
    }
  },
  {
    'name': 'quit',
    'argNum': 0,
    'code': function(args){
      process.exit(0);
    }
  },
  {
    'name': 'help',
    'argNum': 0,
    'code': function(args){
      commands.forEach(function(entry) {
        console.log( entry.toString() );
      });
    }
  }
];
*/

var commands = [
    
];

function processConsoleCommand(dat){
  var command = dat.toString().trim();
    var args;
    
    if(command.indexOf('(') !== -1){ 
        
        var argsEnd = command.indexOf(')') !== -1 ? command.indexOf(')') : command.length;
        args = dat.toString().trim().substring(command.indexOf('(') + 1, argsEnd);
        args = args.split(',');
        for(var i = 0; i < args.length; i++){
            args[i] = args[i].trim();
        }
        
        command = command.substring(0, command.indexOf('('));
        
    }
    
    var commandIndex = 0;
    while(commands[commandIndex].name != command){
        commandIndex++;
        if(commandIndex == commands.length){
            console.log('No such command');
            return;
        }
    }
    
    if((commands[commandIndex].argNum > 0 && !args) || !(!args) && (commands[commandIndex] > args.length)){
        var argsSize = !args ? 0 : args.length;
        console.log('The command ' + commands[commandIndex].name + ' needs ' + commands[commandIndex].argNum + ' arguments, ' + argsSize + ' provided.');
        return;
    }
    
    commands[commandIndex].code(args);
} 



// For imports, to get the functions in another file
module.exports = {
  init : function(bindObject){
    binds = bindObject;
    process.stdin.on('data', function(d){
      processConsoleCommand(d);
    });
  }
};