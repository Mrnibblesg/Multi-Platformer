//CollisionUtils requires the Mathutils file
const distance = require('./MathUtils').distance;
module.exports = {
    pointCircle: function(p,c){
        return distance(p,c.pos) < c.r;
    },
    circle: function(c1, c2){
        return distance(c1.pos,c2.pos) <= c1.r + c2.r;
    },
    rect: function(r1,r2){
        return r1.getX() < r2.getX() + r2.w &&
                r1.getX() + r1.w > r2.getX() &&
                r1.getY() < r2.getY() + r2.h &&
                r1.getY() + r1.h > r2.getY();
    },
    //p1 and p2 are two points on the line
    lineCircle: function(p1,p2,c){
        const s1 = distance(c1.pos,p1);
        const s2 = distance(c1.pos,p2);
        const s3 = distance(p1,p2);
        const ang = Math.acos((s1**2 - s2**2 - s3**2)/(-2 * s2 * s3));
        const dist = Math.sin(ang)*s2;
        return c.r > dist;
    },
    segmentCircle: function(p1,p2,c){
        if (pointCircle(p1,c) || pointCircle(p2,c))
            return true;
        const s1 = distance(c1.pos,p1);
        const s2 = distance(c1.pos,p2);
        const s3 = distance(p1,p2);
        const ang = Math.acos((s1**2 - s2**2 - s3**2)/(-2 * s2 * s3));
    }
}