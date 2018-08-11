function XYPair(pack){
    this.x = pack.x || 0;
    this.y = pack.y || 0;
}
XYPair.prototype.add = function(obj){
    this.x += obj.getX();
    this.y += obj.getY();
}

//x and y as a position
function Position(pack){
    XYPair.call(this,pack);
}
Position.prototype = XYPair.prototype;

//x and y as a vector with x and y components.
//velocities and accelerations should be vectors.
function Vector(pack){
    if (pack.vel === undefined){
        pack.vel = {x:0, y:0};
    }
    XYPair.call(this,pack.vel);
    
}
Vector.prototype = XYPair.prototype;
Vector.prototype.getAngle = function(){ return Math.atan2(this.y,this.x);};
Vector.prototype.getMagnitude = function(){return Math.sqrt(this.x ** 2 + this.y ** 2);};
Vector.prototype.getXComponent = function(amt=1){return this.x * amt;};
Vector.prototype.setXComponent = function(x){this.x = x;};
Vector.prototype.changeXComponent = function(dx){this.x += dx;};
Vector.prototype.getYComponent = function(amt=1){return this.y * amt;};
Vector.prototype.setYComponent = function(y){this.y = y;}
Vector.prototype.changeYComponent = function(dy){this.y += dy;}

Vector.prototype.setAngle = function(ang){
    const mag = this.getMagnitude();
    this.x = mag * Math.cos(ang);
    this.y = mag * Math.sin(ang);
}
Vector.prototype.changeAngle = function(da){this.setAngle(this.getAngle() + da);};

Vector.prototype.setMagnitude = function(mag){
    const ratio = mag / this.getMagnitude();
    this.x *= ratio;
    this.y *= ratio;
}
Vector.prototype.changeMagnitude = function(dm){this.setMagnitude(this.getMagnitude() + dm);};
Vector.prototype.setVelocity = function(vec){
    this.setMagnitude(vector.getMagnitude());
    this.setAngle(vector.getAngle());
}


function Shape(pack){
    this.pos = new Position(pack);
    this.vel = new Vector(pack);
}

Shape.prototype.getPos = function(){return this.pos;};
Shape.prototype.getX = function(){return this.pos.x;};
Shape.prototype.getY = function(){return this.pos.y;};

Shape.prototype.setPos = function(pos){this.pos = pos;}
Shape.prototype.setX = function(x){this.pos.x = x;}
Shape.prototype.setY = function(y){this.pos.y = y;}

Shape.prototype.changeX = function(dx){this.pos.x += dx;}
Shape.prototype.changeY = function(dy){this.pos.y += dy;}

function Rect(pack){
    Shape.call(this,pack);
    this.w = pack.w;
    this.h = pack.h;
    this.col = pack.col || 'black';
}
Rect.prototype = Shape.prototype;

function Circle(pack){
    Shape.call(this,pack);
    this.r = pack.r;
    this.col = pack.col;
}
Circle.prototype = Shape.prototype;

exports.XYPair = XYPair;
exports.Position = Position;
exports.Vector = Vector;
exports.Shape = Shape;
exports.Rect = Rect;
exports.Circle = Circle;
