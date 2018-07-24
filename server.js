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


const DEBUG = false;
const FPS = 60;

const GRAV = 0.6;

const PLAYER_W = 30;
const PLAYER_H = 30;

let initPack = {players:[], platforms: []};
let removePack = {players:[], platforms: []};


let io = require('socket.io')(serv,{});

//add all the listeners as soon as they connect
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log(socket.id);
    
    
    socket.on('signIn', function(data){
        //turn into function call with callback
        usernameCheck(data.username, function(result){
            socket.emit('signInResponse', result);
            
            if (result.success){
                Player.onConnect(socket,data.username);
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
        Player.onDisconnect(socket);
        console.log('Client disconnected');
    });
});



function Entity(params){
    this.toRemove = false;
    this.id = params.id;
}
function Platform(params){
    Entity.call(this,params);
    this.x = params.x;
    this.y = params.y;
    this.w = params.w;
    this.h = params.h;
    
    this.getInitPack = function(){
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    }
    
    this.isColliding = function(rect){
        return this.x < rect.x + rect.w &&
		  this.x + this.w > rect.x &&
		  this.y < rect.y + rect.h &&
		  this.y + this.h > rect.y;
    }
    
    Platform.list[this.id] = this;
    initPack.platforms.push(this.getInitPack());
}
Platform.list = {};

Platform.getAllInitPack = function(){
    let initPack = [];
    for (let id in Platform.list){
        initPack.push(Platform.list[id].getInitPack());
    }
    return initPack;
}


function Player(params){
    Entity.call(this,params);
    
    this.username = params.username;
    this.x = 385;
    this.y = 650;
    this.w = params.w;
    this.h = params.h;
    
    this.prevX = this.x;
    this.prevY = this.y;
    
    
    this.accel = 3;
    this.xVel = 0;
    this.maxXVel = 7;
    
    
    this.canJump = false;
    
    this.yVel = 0;
    this.maxYVel = this.h - 1;
    
    this.col = params.col;
    
    this.keysPressed = {
        left: false,
        right: false,
        up: false,
        down: false
    };
    
    this.update = function(){
        this.updateMovement();
        this.updateCollision();
        
    }
    this.updateMovement = function(){
        const isMoving = mathUtils.xor(this.keysPressed.left, this.keysPressed.right);
        
        this.prevX = this.x;
        this.prevY = this.y;
        
        if (this.keysPressed.left){
            this.xVel -= this.accel;
        }
        if (this.keysPressed.right){
            this.xVel += this.accel;
        }
        if (this.keysPressed.up){
            this.jump();
        }
        
        if (this.xVel > this.maxXVel){
            this.xVel = this.maxXVel;
        }
        else if (this.xVel < -this.maxXVel){
            this.xVel = -this.maxXVel;
        }
        
        this.x += this.xVel;
        if (!isMoving){
            this.xVel *= 0.7;
            if (Math.abs(this.xVel) < 0.1){
                this.xVel = 0;
            }
        }
        //Update y velocity
        this.yVel += GRAV;
        
        if (this.yVel > this.maxYVel){
			this.yVel = this.maxYVel;
		}
        //Update y location
        this.y += this.yVel;
        
    }
    
    this.jump = function(){
        if (this.canJump){
            this.canJump = false;
            this.yVel = -15;
        }
    }
    
    this.updateCollision = function(){
        this.canJump = false;
        for (let id in Platform.list){
            const plat = Platform.list[id];
            if (!plat.isColliding(this)){
                continue;
            }
            //Top collision
            if (this.prevY < plat.y &&
              this.prevX + this.w > plat.x &&
              this.prevX < plat.x + plat.w){
                  
                this.y = plat.y - this.h;
                this.yVel = 0;
                this.canJump = true;
            }
            //Bottom collision
            else if(this.prevY > plat.y + plat.h &&
              this.prevX + this.w > plat.x &&
              this.prevX < plat.x + plat.w){
                  
                this.y = plat.y + plat.h;
                this.yVel = 0;
            }
            //Left collision
            else if (this.prevX < plat.x &&
              this.prevY + this.h > plat.y &&
              this.prevY < plat.y + plat.h){
                  
                this.x = plat.x - this.w;
                this.xVel = 0;
            }
            //Right collision
            else if(this.prevX + this.w > plat.x + plat.w &&
              this.prevY + this.h > plat.y &&
              this.prevY < plat.y + plat.h){
                  
                this.x = plat.x + plat.w;
                this.xVel = 0;
            }
        }
    }
    
    this.getInitPack = function(){
        return {
            username: this.username,
            id: this.id,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
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
        w: PLAYER_W,
        h: PLAYER_H,
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
    
    socket.on('eval', function(command){
        if (DEBUG){
            const result = eval(command);
            console.log(result);
            socket.emit('chatMsgReceive', {username: 'SERVER', message: result});
        }
    });
    socket.emit('init',{
        selfId: socket.id,
        players: Player.getAllInitPack(),
        platforms: Platform.getAllInitPack()
    });
}

Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
    removePack.players.push(socket.id);
}

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
        for (let id in Player.list){
            if (Player.list[id].username === name){
                cb({success: false, message: 'Username taken.'});
                return;
            }
        }
        cb({success: true, message: 'Signed in successfully'});
        
    }
}


(function(){
    new Platform({
        id: Math.random(),
        x: -1000,
        y: 700,
        w: 2800,
        h: 50
    });
    new Platform({
        id: Math.random(),
        x: 50,
        y: 600,
        w: 100,
        h: 50
    });
    new Platform({
        id: Math.random(),
        x: 600,
        y: 600,
        w: 100,
        h: 50
    });
    new Platform({
        id: Math.random(),
        x: 200,
        y: 325,
        w: 100,
        h: 50
    });
    new Platform({
        id: Math.random(),
        x: 300,
        y: 425,
        w: 200,
        h: 50
    });
    
})();



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
	res.sendFile(__dirname + '/html/index.html');
});
app.use('/html', express.static(__dirname + 'html'));

serv.listen(80);
console.log('Server started.');