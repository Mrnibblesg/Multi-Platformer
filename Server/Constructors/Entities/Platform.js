const Entity = require('./Entity');
const shape = require('../Shapes.js');
const collision = require('../../Utils/CollisionUtils');

function Platform(params){
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
    
    //only really needs to be used when platforms
    //are able to be created during gameplay
    //initPack.platforms.push(this.getInitPack());
}
Platform.list = {};

Platform.getAllInitPack = function(){
    let initPack = [];
    for (let id in Platform.list){
        initPack.push(Platform.list[id].getInitPack());
    }
    return initPack;
}

module.exports = Platform;