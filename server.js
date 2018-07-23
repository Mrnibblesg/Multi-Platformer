//Server file
/*let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'localhost',
    user: 
})*/

let mathUtils = require('./Utils/MathUtils');
let collision = require('./Utils/CollisionUtils');


let SOCKET_LIST = {};


let express = require('express');
let app = express();
let serv = require('http').Server(app);


const FPS = 60;

let initPack = {players:[]};
let removePack = {players:[]};


let io = require('socket.io')(serv,{});

//add all the listeners as soon as they connect
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log(socket.id);
    
    
    socket.on('signIn', function(data){
        
        //turn into function call with callbacks
        for (p in Player.list){
            if (p.username === data.username){
                socket.emit('signInResponse', {success: false, message: 'Username taken.'});
                return;
            }
        }
        socket.emit('signInResponse', {success: true, message: 'Login successful.'});
        Player.onConnect(socket,data.username);
        
    });
    
    socket.on('chatMsgSend', function(text){
        for (let i in SOCKET_LIST){
            SOCKET_LIST[i].emit('chatMsgReceive', text);
        }
    });
    
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
    
});



function Entity(params){
    this.toRemove = false;
    this.id = params.id;
}

function Player(params){
    Entity.call(this,params);
    
    this.username = params.username;
    this.x = Math.floor(mathUtils.rand(700,100));
    this.y = Math.floor(mathUtils.rand(700,100));
    this.col = params.col;
    
    this.keysPressed = {
        left: false,
        right: false,
        up: false,
        down: false
    };
    
    this.update = function(){
        if (this.keysPressed.left){
            this.x -= 3;
        }
        if (this.keysPressed.right){
            this.x += 3;
        }
        if (this.keysPressed.up){
            this.y -= 3;
        }
        if (this.keysPressed.down){
            this.y += 3;
        }
        
    }
    
    
    this.getInitPack = function(){
        return {
            username: this.username,
            id: this.id,
            x: this.x,
            y: this.y,
            col: this.col
        };
    };
    
    this.getUpdatePack = function(){
        return {
            id: this.id,
            x: this.x,
            y: this.y
        };
    };
    
    Player.list[this.id] = this;
    initPack.players.push(this.getInitPack());
}
Player.list = {};

Player.getAllInitPack = function(){
    let initPack = [];
    
    for (let id in Player.list){
        const plr = Player.list[id];
        initPack.push(plr.getInitPack());
    }
    return initPack;
}
Player.getAllUpdatePack = function(){
    let pack = [];
    for (let p in Player.list){
        let plr = Player.list[p];
        plr.update();
        pack.push(plr.getUpdatePack());
    }
    return pack;
}
Player.onConnect = function(socket, username){
    
    const colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'indigo',
        'violet',
        'purple',
        'black',
        'gold',
        'lightcoral',
        'maroon',
        'mediumslateblue'
    ];
    
    //MUST use NEW player.
    let plr = new Player({
        username: username,
        id: socket.id,
        col: mathUtils.chooseRand(colors)
    });
    
    socket.on('keyPress', function(key){
        switch(key.inputId){
            case 'l':
                plr.keysPressed.left = key.state;
                break;
            case 'r':
                plr.keysPressed.right = key.state;
                break;
            case 'u':
                plr.keysPressed.up = key.state;
                break;
            case 'd':
                plr.keysPressed.down = key.state;
                break;
        }
    });
    
    socket.emit('init',{
        selfId: socket.id,
        players: Player.getAllInitPack()
    });
}

Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
    removePack.players.push(socket.id);
}


setInterval(function(){
    let pack = {
        players: Player.getAllUpdatePack(),
    }
    
    for (let s in SOCKET_LIST){
        const socket = SOCKET_LIST[s];
        
        socket.emit('init', initPack);
        socket.emit('update', pack);
        socket.emit('remove', removePack);
    }
    
    
    initPack.players = [];
    removePack.players = [];
    
},1000/FPS);



app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + 'client'));

serv.listen(80);
console.log('Server started.');