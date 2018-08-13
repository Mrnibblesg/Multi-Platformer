const collision = require('../../Utils/CollisionUtils');
const mathUtils = require('../../Utils/MathUtils');
const controls = require('../../Libraries/ControlFunctions');
const shape = require('../Shapes');
const packManager = require('../../Engine/packManager');
const listManager = require('../../Engine/listManager');
class Player extends shape.Rect{
    constructor(pack){
        super(pack);
        
        this.username = pack.username;
        
        //change to prevPos and remember to change the collision code to accommodate it
        this.prevX = this.x;
        this.prevY = this.y;
        
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
        
        listManager.addToList('players',this);
        packManager.addInit('players',this.initPack);
    }
    update(platformList){
        this.updateControls();
        this.updateMovement();
        this.updatePosition();
        this.updateCollision(platformList);
    }
    updateControls(){
        if (this.keysPressed['A'] && this.keysPressed['D']){
            this.isMoving = mathUtils.xor(this.keysPressed['A'].state,this.keysPressed['D'].state);
        }
        
        for (let key in this.keysPressed){
            if (!this.keysPressed[key].state){
                continue;
            }
            this.keysPressed[key].run(this);
        }
    }
    updateMovement(){
        this.prevX = this.x;
        this.prevY = this.y;
        
        let vel = this.vel;
        
        if (!this.isMoving){
            vel.x *= 0.7;
            if (Math.abs(vel.x) < 0.1){
                vel.x = 0;
            }
        }
        
        
        //Update y velocity
        vel.y += this.grav;
        
        this.velocityThrottle();
    }
    updatePosition(){
        const vel = this.vel;
        this.x += vel.x;
        this.y += vel.y;
        
        //turn into respawn function
        if (this.y > 3000){
            this.x = 385;
            this.y = 650;
        }
    }
    updateCollision(platformList){
        this.canJump = false;
        this.canWallJump = false;
        this.wallJumpSide = 'none';
        
        for (let id in platformList){
            const plat = platformList[id];
            
            switch (collision.playerRect(this,plat)){
                case 'top':{
                    this.y = plat.y - this.h;
                    this.vel.y = 0;
                    this.canJump = true;
                    this.canExtraJump = true;
                    break;
                }
                case 'bottom':{
                    this.y = plat.y + plat.h;
                    this.vel.y = 0;
                    break;
                }
                case 'left':{
                    this.x = plat.x - this.w;
                    this.vel.x = 0;
                    this.canWallJump = true;
                    this.wallJumpSide = 'left';
                    break;
                }
                case 'right':{
                    this.x = plat.x + plat.w;
                    this.vel.x = 0;
                    this.canWallJump = true;
                    this.wallJumpSide = 'right';
                    break;
                }
            }
        }
    }
    velocityThrottle(){
        let vel = this.vel;
        
        //Throttle x momentum.
        //Probably find a way to combine the two if blocks.
        //More importantly, find a good way to preserve momentum
        //that goes above the maximum
        if (vel.x > this.maxXVel){
            const diff = vel.x - this.maxXVel;
            
            if (vel.x - this.accel > this.maxXVel){
                vel.x -= this.accel;
            }
            
        }
        else if (vel.x < -this.maxXVel){
            const diff = vel.x + this.maxXVel;
            
            if (vel.x + this.accel < -this.maxXVel){
                vel.x += this.accel;
            }
        }
        if (vel.y > this.maxYVel){
            vel.y = this.maxYVel;
        }
    }
    jump(){
        if (this.canJump){
            this.canJump = false;
            this.vel.y = -15;
        }
    }
    extraJump(){
        if (this.canWallJump){
            this.vel.y = -12;
            if (this.wallJumpSide === 'left'){
                this.vel.x = -25;
            }
            else if (this.wallJumpSide === 'right'){
                this.vel.x = 25;
            }
            
            
        }
        else if (this.canExtraJump){
            this.canExtraJump = false;
            this.vel.y = -12;
        }
    }
    get initPack(){
        return {
            username: this.username,
            id: this.id,
            pos: this.pos,
            w: this.w,
            h: this.h,
            col: this.col
        };
    }
    get updatePack(){
        return {
            id: this.id,
            pos: this.pos
        };
    }
    static get allInitPack(){
        let initPack = [];
        
        const playerList = listManager.getList('players');
        for (let id in playerList){
            const plr = playerList[id];
            initPack.push(plr.initPack);
        }
        return initPack;
    }
    static get allUpdatePack(){
        
        let pack = [];
        const playerList = listManager.getList('players');
        const platformList = listManager.getList('platforms');
        for (let id in playerList){
            let plr = playerList[id];
            plr.update(platformList);
            pack.push(plr.updatePack);
        }
        return pack;
    }
    static onConnect(socket,username){
        
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
        });
        
        const run = function(plr){
            if (!this.tapped){
                this.tapped = true;
                this.tap(plr);
            }
            
            this.hold(plr);
        }
        
        //Used for controls with no binding for the time being.
        const none = function(){}
        
        //default keybinds
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
    static onDisconnect(socket){
        listManager.removeFromList('players',socket.id);
        packManager.addRemove('players',socket.id);
    }
}
module.exports = Player;