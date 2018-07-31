//The library of controls exist to increase modularity of the player's controls
function moveLeft(obj){
    if (!obj.isMoving){return;}
    if (!obj.canJump){
        obj.vel.changeXComponent(-obj.accel * 0.75);
    }
    else{
        obj.vel.changeXComponent(-obj.accel);
    }
    
}
function moveRight(obj){
    if (!obj.isMoving){return;}
    if (!obj.canJump){
        obj.vel.changeXComponent(obj.accel * 0.75);
    }
    else{
        obj.vel.changeXComponent(obj.accel);
    }
}
function extraJump(obj){
    if (obj.canJump){return;}
    obj.extraJump();
}
function normalJump(obj){
    obj.jump();
}
exports.moveLeft = moveLeft;
exports.moveRight = moveRight;
exports.normalJump = normalJump;
exports.extraJump = extraJump;