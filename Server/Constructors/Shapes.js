function XYPair(pack){
    this.x = pack.x || 0;
    this.y = pack.y || 0;
    
    this.add = function(obj){
        this.x += obj.getX();
        this.y += obj.getY();
    }
}

//x and y as a position
function Position(pack){
    XYPair.call(this,pack);
}

//x and y as a vector with x and y components.
//velocities and accelerations should be vectors.
function Vector(pack){
    if (pack.vel === undefined){
        pack.vel = {x:0, y:0};
    }
    XYPair.call(this,pack.vel);
    
    this.getAngle = function(){
        return Math.atan2(this.y,this.x);
    }
    this.getMagnitude = function(){
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    
    this.getXComponent = function(amt=1){
        return this.x * amt;
    }
    this.setXComponent = function(x){
        this.x = x;
    }
    this.changeXComponent = function(dx){
        this.x += dx;
    }
    
    this.getYComponent = function(amt=1){
        return this.y * amt;
    }
    this.setYComponent = function(y){
        this.y = y;
    }
    this.changeYComponent = function(dy){
        this.y += dy;
    }
    
    //ang is the angle in radians
    this.setAngle = function(ang){
        const mag = this.getMagnitude();
        this.x = mag * Math.cos(ang);
        this.y = mag * Math.sin(ang);
    }
    this.changeAngle = function(da){
        this.setAngle(this.getAngle() + da);
    }
    
    this.setMagnitude = function(mag){
        const ratio = mag / this.getMagnitude();
        this.x *= ratio;
        this.y *= ratio;
    }
    this.changeMagnitude = function(dm){
        this.setMagnitude(this.getMagnitude() + dm);
    }
}

function Movable(pack){
    if (this.pos == undefined){
        console.error("Attempted to make an object with no location movable.");
        console.log(this);
        return;
    }
    
    this.vel = new Vector(pack);
    
    this.setVelocity = function(vector){
        this.vel.setMagnitude(vector.getMagnitude());
        this.vel.setAngle(vector.getAngle());
    }
    this.move = function(amt){
        this.changeX(this.vel.getXComponent(amt));
        this.changeY(this.vel.getYComponent(amt));
    }
}


function Shape(pack){
    this.pos = new Position(pack);
    
    Movable.call(this,pack);
    
    this.getPos = function(){return this.pos;}
    this.getX = function(){return this.pos.x;}
    this.getY = function(){return this.pos.y;}
    
    this.setPos = function(pos){this.pos = pos;}
    this.setX = function(x){this.pos.x = x;}
    this.setY = function(y){this.pos.y = y;}
    
    this.changeX = function(dx){this.pos.x += dx;}
    this.changeY = function(dy){this.pos.y += dy;}
    
    this.update = function(){
        this.move();
    }
}

function Rect(pack){
    Shape.call(this,pack);
    this.w = pack.w;
    this.h = pack.h;
    this.col = pack.col || 'black';
}
function Circle(pack){
    Shape.call(this,pack);
    this.r = pack.r;
    this.col = pack.col;
}

exports.XYPair = XYPair;
exports.Position = Position;
exports.Vector = Vector;
exports.Shape = Shape;
exports.Movable = Movable;
exports.Rect = Rect;
exports.Circle = Circle;
