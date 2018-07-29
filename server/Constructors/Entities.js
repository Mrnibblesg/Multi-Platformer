const mathUtils = require('../Utils/MathUtils');
const shape = require('./Shapes.js');
const collision = require('../Utils/CollisionUtils');

function Entity(params){
    this.toRemove = false;
    this.id = params.id;
}

function Platform(params,initPack){
    Entity.call(this,params);
    shape.Rect.call(this,params);
    
    this.getInitPack = function(){
        return {
            id: this.id,
            x: this.getX(),
            y: this.getY(),
            w: this.w,
            h: this.h
        };
    }
    
    this.isColliding = function(rect){
        return collision.rect(this,rect);
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

function Player(params,initPack){
    Entity.call(this,params);
    shape.Rect.call(this,params);
    
    this.username = params.username;
    
    //change to prevPos and remember to change the collision to accommodate it
    this.prevX = this.getX();
    this.prevY = this.getY();
    
    this.grav = 0.6;
    
    this.accel = 3;
    this.maxXVel = 7;
    
    this.canJump = false;
    
    this.maxYVel = this.h - 1;
    
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
        
        this.prevX = this.getX();
        this.prevY = this.getY();
        
        let vel = this.vel;
        
        if (this.keysPressed.left){
            vel.changeXComponent(-this.accel);
        }
        if (this.keysPressed.right){
            vel.changeXComponent(this.accel);
        }
        if (this.keysPressed.up){
            this.jump();
        }
        
        if (vel.getXComponent() > this.maxXVel){
            vel.setXComponent(this.maxXVel);
        }
        else if (vel.getXComponent() < -this.maxXVel){
            vel.setXComponent(-this.maxXVel);
        }
        
        this.changeX(vel.getXComponent());
        if (!isMoving){
            vel.setXComponent(vel.getXComponent() * 0.7);
            if (Math.abs(vel.getXComponent()) < 0.1){
                vel.setXComponent(0);
            }
        }
        //Update y velocity
        vel.changeYComponent(this.grav);
        
        if (vel.getYComponent() > this.maxYVel){
			vel.setYComponent(this.maxYVel);
		}
        //Update y location
        this.changeY(vel.getYComponent());
        
    }
    
    this.jump = function(){
        if (this.canJump){
            this.canJump = false;
            this.vel.setYComponent(-15);
        }
    }
    
    this.updateCollision = function(){
        this.canJump = false;
        for (let id in Platform.list){
            const plat = Platform.list[id];
            if (!plat.isColliding(this)){
                continue;
            }
            
            //Find a way to integrate this into CollisionUtils.js
            //Top collision
            if (this.prevY < plat.getY() &&
              this.prevX + this.w > plat.getX() &&
              this.prevX < plat.getX() + plat.w){
                  
                this.setY(plat.getY() - this.h);
                this.vel.setYComponent(0);
                this.canJump = true;
            }
            //Bottom collision
            else if(this.prevY > plat.getY() + plat.h &&
              this.prevX + this.w > plat.getX() &&
              this.prevX < plat.getX() + plat.w){
                  
                this.setY(plat.getY() + plat.h)
                this.vel.setYComponent(0);
            }
            //Left collision
            else if (this.prevX < plat.getX() &&
              this.prevY + this.h > plat.getY() &&
              this.prevY < plat.getY() + plat.h){
                  
                this.setX(plat.getX() - this.w);
                this.vel.setXComponent(0);
            }
            //Right collision
            else if(this.prevX + this.w > plat.getX() + plat.w &&
              this.prevY + this.h > plat.getY() &&
              this.prevY < plat.getY() + plat.h){
                  
                this.setX(plat.getX() + plat.w);
                this.vel.setXComponent(0);
            }
        }
    }
    
    this.getInitPack = function(){
        return {
            username: this.username,
            id: this.id,
            pos: this.pos,
            w: this.w,
            h: this.h,
            col: this.col
        };
    };
    
    this.getUpdatePack = function(){
        return {
            id: this.id,
            pos: this.pos
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
    for (let id in Player.list){
        let plr = Player.list[id];
        plr.update();
        pack.push(plr.getUpdatePack());
    }
    return pack;
}
Player.onConnect = function(socket, username, initPack){
    
    const colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'indigo',
        'violet',
        'purple',
        'gold',
        'lightcoral',
        'maroon',
        'mediumslateblue'
    ];
    
    //MUST use NEW player.
    let plr = new Player({
        username: username,
        id: socket.id,
        x: 385,
        y: 650,
        vel: {
            x: 0,
            y: -5
        },
        w: 30,
        h: 30,
        col: mathUtils.chooseRand(colors)
    },initPack);
    
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
        players: Player.getAllInitPack(),
        platforms: Platform.getAllInitPack()
    });
}

Player.onDisconnect = function(socket,removePack){
    delete Player.list[socket.id];
    removePack.players.push(socket.id);
}

exports.Entity = Entity;
exports.Platform = Platform;
exports.Player = Player;