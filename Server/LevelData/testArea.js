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
console.log(Platform);
const platforms = [
    new Platform({
        id: next(),
        x: -1000,
        y: 700,
        vel: vel,
        w: 58000,
        h: 50
    }),
    new Platform({
        id: next(),
        x: 50,
        y: 600,
        vel: vel,
        w: 100,
        h: 50
    }),
    new Platform({
        id: next(),
        x: 600,
        y: 600,
        vel: vel,
        w: 100,
        h: 50
    }),
    new Platform({
        id: next(),
        x: 200,
        y: 325,
        vel: vel,
        w: 100,
        h: 50
    }),
    new Platform({
        id: next(),
        x: 300,
        y: 425,
        vel: vel,
        w: 200,
        h: 50
    }),
    new Platform({
        id: next(),
        x: -200,
        y: 400,
        vel: vel,
        w: 200,
        h: 50
    }),
    new Platform({
        id: next(),
        x: -600,
        y: 400,
        vel: vel,
        w: 200,
        h: 50
    }),
    new Platform({
        id: next(),
        x: 850,
        y: 400,
        vel: vel,
        w: 50,
        h: 300
    })
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