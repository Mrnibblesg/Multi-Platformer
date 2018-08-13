
class XYPair {
    constructor(pack){
        this.x = pack.x;
        this.y = pack.y;
    }
    add(pair){
        this.x += pair.x;
        this.y += pair.y;
    }
}
class Position extends XYPair {
    constructor(pack){
        super(pack);
    }
}
class Vector extends XYPair {
    constructor(pack){
        if (pack.vel === undefined){
            pack.vel = {x:0, y:0};
        }
        super(pack.vel);
    }
    
    
    get angle(){
        return Math.atan2(this.y,this.x);
    }
    
    set angle(ang){
        const mag = this.magnitude;
        this.x = mag * Math.cos(ang);
        this.y = mag * Math.sin(ang);
    }
    
    get magnitude(){
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    set magnitude(mag){
        const ratio = mag / this.magnitude;
        this.x *= ratio;
        this.y *= ratio;
    }
    copy(vec){
        this.x = vec.x;
        this.y = vec.y;
    }
}

class Entity{
    constructor(pack){
        this.id = pack.id;
        this.toRemove = false;
    }
}

class Shape extends Entity{
    constructor(pack){
        super(pack);
        this.pos = new Position(pack);
        this.vel = new Vector(pack);
        this.col = pack.col || 'black';
    }
    get x(){
        return this.pos.x;
    }
    get y(){
        return this.pos.y;
    }
    set x(val){
        this.pos.x = val;
    }
    set y(val){
        this.pos.y = val;
    }
}
class Rect extends Shape{
    constructor(pack){
        super(pack);
        this.w = pack.w;
        this.h = pack.h;
    }
}
class Circle extends Shape{
    constructor(pack){
        super(pack);
        this.r = pack.r;
    }
}
exports.XYPair = XYPair;
exports.Position = Position;
exports.Vector = Vector;
exports.Entity = Entity;
exports.Shape = Shape;
exports.Rect = Rect;
exports.Circle = Circle;