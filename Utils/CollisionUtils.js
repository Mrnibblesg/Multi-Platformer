//CollisionUtils requires the Mathutils file
module.exports = {
    pointCircleCollision: function(p,c){
        return distance(p,c.pos) < c.r;
    },
    circleCollision: function(c1, c2){
        return distance(c1.pos,c2.pos) <= c1.r + c2.r;
    },
    rectCollision: function(r1,r2){
        return r1.x < r2.x + r2.w &&
                r1.x + r1.w > r2.x &&
                r1.y < r2.y + r2.h &&
                r1.y + r1.h > r2.y
    },
    //p1 and p2 are two points on the line
    lineCircleCollision: function(p1,p2,c){
        const s1 = distance(c1.pos,p1);
        const s2 = distance(c1.pos,p2);
        const s3 = distance(p1,p2);
        const ang = Math.acos((s1**2 - s2**2 - s3**2)/(-2 * s2 * s3));
        const dist = Math.sin(ang)*s2;
        return c.r > dist;
    },
    segmentCircleCollision: function(p1,p2,c){
        if (pointCircleCollision(p1,c) || pointCircleCollision(p2,c))
            return true;
        const s1 = distance(c1.pos,p1);
        const s2 = distance(c1.pos,p2);
        const s3 = distance(p1,p2);
        const ang = Math.acos((s1**2 - s2**2 - s3**2)/(-2 * s2 * s3));
    }
}