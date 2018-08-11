const Entity = require('./Entity');
const shape = require('../Shapes.js');
const collision = require('../../Utils/CollisionUtils');

function Platform(params){
    Entity.call(this,params);
    shape.Rect.call(this,params);
    Platform.list[this.id] = this;
    
    //only really needs to be used when platforms
    //are able to be created during gameplay
    
    //initPack.platforms.push(this.getInitPack());
}
Platform.list = {};

Platform.prototype = shape.Rect.prototype;
Platform.prototype.getInitPack = function(){
    return {
        id: this.id,
        x: this.getX(),
        y: this.getY(),
        w: this.w,
        h: this.h
    };
}
Platform.prototype.isColliding = function(rect){
    return collision.rect(this,rect);
}

Platform.getAllInitPack = function(){

    let initPack = [];
    for (let id in Platform.list){
        let platform = Platform.list[id];
        let pack = platform.getInitPack();

        console.log(pack);
        
        initPack.push(pack);
    }
    return initPack;
}

module.exports = Platform;