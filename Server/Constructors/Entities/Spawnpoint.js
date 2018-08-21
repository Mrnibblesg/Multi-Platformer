const shape = require('../Shapes');
const listManager = require('../../Engine/listManager');
class Spawnpoint extends shape.Shape{
    constructor(pack){
        super(pack);
        this.spawnVel = pack.spawnVel;
        delete this.col;
        listManager.addToList('spawnpoints',this);
    }
    spawn(obj){
        obj.pos.copy(this.pos);
        obj.vel.copy(this.spawnVel);
    }
}
module.exports = Spawnpoint;