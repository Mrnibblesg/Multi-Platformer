class XYPair{
    constructor(pack){
        this.x = pack.x;
        this.y = pack.y;
    }
    add(pair){
        this.x += pair.x;
        this.y += pair.y;
    }
}
class Position extends XYPair{
    constructor(pack){
        super(pack);
    }
}
class Entity{
    constructor(pack){
        this.id = pack.id;
    }
}
class Shape extends Entity{
    constructor(pack){
        super(pack);
        this.pos = new Position(pack.pos);
    }
    set x(value){
        this.pos.x = value;
    }
    set y(value){
        this.pos.y = value;
    }
    get x(){
        return this.pos.x;
    }
    get y(){
        return this.pos.y;
    }
}
class Rect extends Shape{
    constructor(pack){
        console.log(pack);
        super(pack);
        this.w = pack.w;
        this.h = pack.h;
        this.col = pack.col || 'black';
    }
    
}
class Circle extends Shape{
    constructor(pack){
        super(pack);
        this.r = pack.r;
    }
}

//THIS NEEDS TO BE MADE BETTER
class Text extends Shape{
    constructor(pack){
        pack.pos = {x:0,y:0};
        super(pack);
        this.msg = pack.msg;
        this.font = pack.font;
        this.col = pack.col;
    }
    follow(obj, offset){
        this.pos = {
            x: obj.x + offset.x,
            y: obj.y + offset.y
        };
    }
}
