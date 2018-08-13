//CollisionUtils requires the Mathutils file
const distance = require('./MathUtils').distance;

function pointCircle(p,c){
    return distance(p,c.pos) < c.r;
}
function circle(c1, c2){
    return distance(c1.pos,c2.pos) <= c1.r + c2.r;
}
function rect(r1,r2){
    return r1.x < r2.x + r2.w &&
            r1.x + r1.w > r2.x &&
            r1.y < r2.y + r2.h &&
            r1.y + r1.h > r2.y;
}
function playerRect(p,r){
    if (!rect(p,r)){
        return false;
    }
    
    if (p.prevY < r.y &&
      p.prevX + p.w > r.x &&
      p.prevX < r.x + r.w){
          
        return 'top';
    }
    //Bottom collision
    else if(p.prevY > r.y + r.h &&
      p.prevX + p.w > r.x &&
      p.prevX < r.x + r.w){
          
        return 'bottom';
    }
    //Left collision
    else if (p.prevX < r.x &&
      p.prevY + p.h > r.y &&
      p.prevY < r.y + r.h){
          
        return 'left';
    }
    //Right collision
    else if(p.prevX + p.w > r.x + r.w &&
      p.prevY + p.h > r.y &&
      p.prevY < r.y + r.h){
          
        return 'right';
    }
}
//p1 and p2 are two points on the line
function lineCircle(p1,p2,c){
    const s1 = distance(c1.pos,p1);
    const s2 = distance(c1.pos,p2);
    const s3 = distance(p1,p2);
    const ang = Math.acos((s1**2 - s2**2 - s3**2)/(-2 * s2 * s3));
    const dist = Math.sin(ang)*s2;
    return c.r > dist;
}
function segmentCircle(p1,p2,c){
    if (pointCircle(p1,c) || pointCircle(p2,c))
        return true;
    const s1 = distance(c1.pos,p1);
    const s2 = distance(c1.pos,p2);
    const s3 = distance(p1,p2);
    const ang = Math.acos((s1**2 - s2**2 - s3**2)/(-2 * s2 * s3));
}


exports.pointCircle = pointCircle;
exports.circle = circle;
exports.rect = rect;
exports.playerRect = playerRect;
exports.lineCircle = lineCircle;
exports.segmentCircle = segmentCircle;