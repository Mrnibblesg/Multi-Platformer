function XYPair(pack){
    this.x = pack.x;
    this.y = pack.y;
}

//x and y as a position
function Position(pack){
    XYPair.call(this,pack);
}

function Shape(pack){
    this.pos = new Position(pack);
    
    this.setPos = function(pos){this.pos = pos;}
    this.getPos = function(){return this.pos;}
    this.getX = function(){return this.pos.x;}
    this.getY = function(){return this.pos.y;}
}

function Rect(pack){
    Shape.call(this,pack);
    this.w = pack.w;
    this.h = pack.h;
    this.col = pack.col || 'black';
    
    this.draw = function(){
        
    }
}
function Circle(pack){
    Shape.call(this,pack);
    this.r = pack.r;
    this.col = pack.col;
    
    this.draw = function(){
        
    }
}
//THIS NEEDS TO BE MADE BETTER
function Text(pack){
    Shape.call(this,pack);
    this.msg = pack.msg,
    this.font = pack.font,
    this.col = pack.col;
    
    this.follow = function(obj,offset){
        this.setPos({
            x: obj.getX() + offset.x,
            y: obj.getY() + offset.y
        });
    }
}
