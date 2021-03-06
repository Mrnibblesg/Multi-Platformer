function rand(max,min=0){
    return Math.random()*(max-min)+min;
}
function chooseRand(a){
    return a[Math.floor(this.rand(a.length))];
}
function chooseRandProp(obj){
    return obj[this.chooseRand(Object.keys(obj))];
}
function min(a){
    if (a.length === 1){return a[0];}
    const min = a[0];
    for (const val of a)
        if (val < min){min=val;}
    return min;
}
function max(a){
    if (a.length === 1){return a[0];}
    const max = a[0];
    for (const val of a)
        if (val > max){max=val;}
    return max;
}
function average(a){
    let s = 0;
    for (const n of a)
        s += n;
    return s / a.length;
}
function distance(p1,p2){
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx**2 + dy**2);
}

//Maps a value to a new minimum and maximum.
//Ex: Mapping the value 15 from 10 - 20 to -5 - 5 would yield 0,
//since 15 is halfway between 10 and 20, and 0 is halfway between -5 and 5.

//Works even if val is outside min and max values.
//Ex: scale(-1,   0, 1,  10, 20,) --> 0
function scale(val, oldmin,oldmax, newmin,newmax){
    const ratio = (val-oldmin) / (oldmax-oldmin);
    return ratio * (newmax-newmin) + newmin;
}
function xor(a,b){
    return !(a === b);
}
//add way to differentiate between >= and >
function inRange(val, min, max){
    return (val > min && val < max);
}

exports.rand = rand;
exports.chooseRand = chooseRand;
exports.chooseRandProp = chooseRandProp;
exports.min = min;
exports.max = max;
exports.average = average;
exports.distance = distance;
exports.scale = scale;
exports.xor = xor;
exports.inRange = inRange;
