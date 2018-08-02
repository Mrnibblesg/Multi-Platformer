//Server file
/*let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'localhost',
    user: 
})*/

let mathUtils = require('./Server/Utils/MathUtils');
let collision = require('./Server/Utils/CollisionUtils');
let entities = require('./Server/Constructors/Entities');

let SOCKET_LIST = {};

let path = require('path');
let express = require('express');
let app = express();
let serv = require('http').Server(app);

let level = require('./Server/LevelData/testArea2');


const DEBUG = false;
const FPS = 60;

const GRAV = 0.6;

let initPack = {players:[], platforms: []};
let removePack = {players:[], platforms: []};

let io = require('socket.io')(serv,{});

//add all the listeners as soon as they connect
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log(socket.id);
    
    
    socket.on('signIn', function(data){
        usernameCheck(data.username, function(result){
            socket.emit('signInResponse', result);
            
            if (result.success){
                entities.Player.onConnect(socket,data.username,initPack);
                socket.emit('init',{
                    selfId: socket.id,
                    players: entities.Player.getAllInitPack(),
                    platforms: entities.Platform.getAllInitPack()
                });
            }
        });
    });
    
    socket.on('chatMsgSend', function(text){
        for (let i in SOCKET_LIST){
            SOCKET_LIST[i].emit('chatMsgReceive', text);
        }
    });
    
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        entities.Player.onDisconnect(socket,removePack);
        console.log('Client disconnected');
    });
});



function usernameCheck(name, cb){
    
    let validCharacters = /^[a-z0-9_-]{3,15}$/gi
    if (name.length > 15){
        cb({success: false, message: 'Username is too long.'});
    }
    else if (name.length < 3){
        cb({success: false, message: 'Username is too short.'});
    }
    else if (!validCharacters.test(name)){
        cb({success: false, message: 'Username must only contain alphanumeric characters, underscores and hyphens.'});
    }
    else{
        for (let id in entities.Player.list){
            if (entities.Player.list[id].username === name){
                cb({success: false, message: 'Username taken.'});
                return;
            }
        }
        cb({success: true, message: 'Signed in successfully'});
        
    }
}

level.loadLevel(initPack);


setInterval(function(){
    let pack = {
        players: entities.Player.getAllUpdatePack(),
    }
    
    for (let s in SOCKET_LIST){
        const socket = SOCKET_LIST[s];
        
        socket.emit('init', initPack);
        socket.emit('update', pack);
        socket.emit('remove', removePack);
    }
    
    
    initPack.players = [];
    initPack.platforms = [];
    removePack.players = [];
    removePack.platforms = [];
    
},1000/FPS);

const clientPath = path.join(__dirname, 'html');
app.use(express.static(clientPath));

serv.listen(80);
console.log('Server started.');