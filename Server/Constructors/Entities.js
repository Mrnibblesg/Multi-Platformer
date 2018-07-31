const mathUtils = require('../Utils/MathUtils');
const shape = require('./Shapes.js');
const collision = require('../Utils/CollisionUtils');
const controls = require('../Libraries/ControlFunctions');

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
    
    this.isMoving = false;
    
    this.canJump = false;
    this.canExtraJump = false;
    this.canWallJump = false;
    
    this.maxYVel = this.h - 1;
    
    this.keysPressed = {};
    
    this.update = function(){
        this.updateControls();
        this.updateMovement();
        this.updatePosition();
        this.updateCollision();
        
        
    }
    this.updateControls = function(){
        if (this.keysPressed['A'] && this.keysPressed['D']){
            this.isMoving = mathUtils.xor(this.keysPressed['A'].state,this.keysPressed['D'].state);
        }
        
        for (key in this.keysPressed){
            if (!this.keysPressed[key].state){
                continue;
            }
            this.keysPressed[key].run(this);
        }
    }
    this.updateMovement = function(){
        
        this.prevX = this.getX();
        this.prevY = this.getY();
        
        let vel = this.vel;
        
        if (vel.getXComponent() > this.maxXVel){
            vel.setXComponent(this.maxXVel);
        }
        else if (vel.getXComponent() < -this.maxXVel){
            vel.setXComponent(-this.maxXVel);
        }
        
        if (!this.isMoving){
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
        
    }
    
    this.jump = function(){
        if (this.canJump){
            this.canJump = false;
            this.vel.setYComponent(-15);
        }
    }
    this.extraJump = function(){
        if (this.canExtraJump){
            this.canExtraJump = false;
            this.vel.setYComponent(-12);
        }
    }
    
    this.updatePosition = function(){
        const vel = this.vel;
        this.changeX(vel.getXComponent());
        this.changeY(vel.getYComponent());
    }
    
    this.updateCollision = function(){
        this.canJump = false;
        this.canWallJump = false;
        
        for (let id in Platform.list){
            const plat = Platform.list[id];
            
            switch (collision.playerRect(this,plat)){
                case 'top':{
                    this.setY(plat.getY() - this.h);
                    this.vel.setYComponent(0);
                    this.canJump = true;
                    this.canExtraJump = true;
                    break;
                }
                case 'bottom':{
                    this.setY(plat.getY() + plat.h);
                    this.vel.setYComponent(0);
                    break;
                }
                case 'left':{
                    this.setX(plat.getX() - this.w);
                    this.vel.setXComponent(0);
                    this.canWallJump = true;
                    break;
                }
                case 'right':{
                    this.setX(plat.getX() + plat.w);
                    this.vel.setXComponent(0);
                    this.canWallJump = true;
                    break;
                }
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
    
    const run = function(plr){
        if (!this.tapped){
            this.tapped = true;
            this.tap(plr);
        }
        
        this.hold(plr);
    }
    
    //Used for controls with no binding for the time being.
    const none = function(){}
    
    plr.keysPressed = {
        A: {
            state: false,
            tapped: false,
            run: run,
            tap: none,
            hold: controls.moveLeft
        },
        D: {
            state: false,
            tapped: false,
            run: run,
            tap: none,
            hold: controls.moveRight
        },
        W: {
            state: false,
            tapped: false,
            run: run,
            tap: controls.extraJump,
            hold: controls.normalJump
        },
        S: {
            state: false,
            tapped: false,
            run: run,
            tap: none,
            hold: none
        }
    };
    
    
    
    socket.on('keyPress', function(key){
        let plrKey = plr.keysPressed[key.inputId];
        
        if (plrKey === undefined){
            //default key settings
            plrKey = {
                state: false,
                tapped: false,
                run: run,
                tap: none,
                hold: none
            }
        }
        
        plrKey.state = key.state;
        if (!key.state){
            plrKey.tapped = false;
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