const shape = require('../Shapes.js');
const collision = require('../../Utils/CollisionUtils');
const listManager = require('../../Engine/listManager');

class Platform extends shape.Rect{
    constructor(pack){
        super(pack);
        listManager.addToList('platforms',this);
    }
    get initPack(){
        return {
            id: this.id,
            pos: this.pos,
            w: this.w,
            h: this.h
        };
    }
    isColliding(rect){
        return collision.rect(this,rect);
    }
    
    static get allInitPack(){
        let initPack = [];
        const platforms = listManager.getList('platforms');
        for (let id in platforms){
            const platform = platforms[id];
            initPack.push(platform.initPack);
        }
        return initPack;
    }
}
module.exports = Platform;