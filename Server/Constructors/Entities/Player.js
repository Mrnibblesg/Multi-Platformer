const Entity = require('./Entity');
const Platform = require('./Platform');
const collision = require('../../Utils/CollisionUtils');
const mathUtils = require('../../Utils/MathUtils');
const controls = require('../../Libraries/ControlFunctions');
const shape = require('../Shapes');

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
    this.wallJumpSide = 'none';
    
    this.maxYVel = this.h - 1;
    
    this.keysPressed = {};
    
    this.update = function(platformList){
        this.updateControls();
        this.updateMovement();
        this.updatePosition();
        this.updateCollision(platformList);
        

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
        
        if (this.overMaxSpeed()){
            this.velocityThrottle();
        }
        
        
        if (!this.isMoving){
            vel.setXComponent(vel.getXComponent() * 0.7);
            if (Math.abs(vel.getXComponent()) < 0.1){
                vel.setXComponent(0);
            }
        }
        
        
        //Update y velocity
        vel.changeYComponent(this.grav);
        
        //Throttle y velocity
        if (vel.getYComponent() > this.maxYVel){
            vel.setYComponent(this.maxYVel);
		}
        
    }
    
    this.velocityThrottle = function(){
        let vel = this.vel;
        
        //Throttle x momentum.
        //Probably find a way to combine the two if blocks.
        //More importantly, find a good way to preserve momentum
        //that goes above the maximum
        if (vel.getXComponent() > this.maxXVel){
            const diff = vel.getXComponent() - this.maxXVel;
            
            if (vel.getXComponent() - this.accel > this.maxXVel){
                vel.changeXComponent(-this.accel);
            }
            
        }
        else if (vel.getXComponent() < -this.maxXVel){
            const diff = vel.getXComponent() + this.maxXVel;
            
            if (vel.getXComponent() + this.accel < -this.maxXVel){
                vel.changeXComponent(this.accel);
            }
        }
    }
    
    this.overMaxSpeed = function(){
        return Math.abs(this.vel.getXComponent()) > this.maxXVel;
    }
    
    this.jump = function(){
        if (this.canJump){
            this.canJump = false;
            this.vel.setYComponent(-15);
        }
    }
    this.extraJump = function(){
        if (this.canWallJump){
            this.vel.setYComponent(-12);
            if (this.wallJumpSide === 'left'){
                this.vel.setXComponent(-25);
            }
            else if (this.wallJumpSide === 'right'){
                this.vel.setXComponent(25);
            }
            
            
        }
        else if (this.canExtraJump){
            this.canExtraJump = false;
            this.vel.setYComponent(-12);
        }
    }
    
    this.updatePosition = function(){
        const vel = this.vel;
        this.changeX(vel.getXComponent());
        this.changeY(vel.getYComponent());
        
        if (this.getY() > 3000){
            this.setX(385);
            this.setY(650);
        }
        
    }
    
    this.updateCollision = function(list){
        this.canJump = false;
        this.canWallJump = false;
        this.wallJumpSide = 'none';
        
        for (let id in list){
            const plat = list[id];
            
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
                    this.wallJumpSide = 'left';
                    break;
                }
                case 'right':{
                    this.setX(plat.getX() + plat.w);
                    this.vel.setXComponent(0);
                    this.canWallJump = true;
                    this.wallJumpSide = 'right';
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
        plr.update(Platform.list);
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
}

Player.onDisconnect = function(socket,removePack){
    delete Player.list[socket.id];
    removePack.players.push(socket.id);
}
module.exports = Player;