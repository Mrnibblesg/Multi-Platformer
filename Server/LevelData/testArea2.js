const Platform = require('../Constructors/Entities').Platform;

//used for assigning ids
function next(){
    return next.num++;
}
next.num = 0;

const vel = {
    x:0,
    y:0
};
const platforms = [
    new Platform({
        id: next(),
        x: 0,
        y: 700,
        vel: vel,
        w: 770,
        h: 50
    }),
    new Platform({
        id: next(),
        x: 720,
        y: -500,
        vel: vel,
        w: 50,
        h: 1200
    }),
    new Platform({
        id: next(),
        x: 0,
        y: -500,
        vel: vel,
        w: 50,
        h: 1200
    }),
    new Platform({
        id: next(),
        x: 360,
        y: -200,
        vel: vel,
        w: 50,
        h: 500
    }),
    new Platform({
        id: next(),
        x: 0,
        y: -1400,
        vel: vel,
        w: 100,
        h: 950
    }),
    new Platform({
        id: next(),
        x: 670,
        y: -1400,
        vel: vel,
        w: 100,
        h: 950
    }),
    new Platform({
        id: next(),
        x: 300,
        y: -400,
        vel: vel,
        w: 200,
        h: 50
    }),
    
];
platforms.getAllInitPack = function(){
    let pack = [];
    for (let platform of platforms){
        pack.push(platform.getInitPack);
    }
    return pack;
}

function loadLevel(initPack){
    initPack.platforms = platforms.getAllInitPack();
}
exports.loadLevel = loadLevel;