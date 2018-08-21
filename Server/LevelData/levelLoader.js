const fs = require('fs');
const entities = require('../Constructors/Entities');
const packManager = require('../Engine/packManager');
const listManager = require('../Engine/listManager');
function loadLevel(name){
    const path = './Server/LevelData/';
    
    fs.readFile(path + name, 'utf8', (err, data) => {
        if (err) {throw err;}
        doneLoading(data);
    });
}
function doneLoading(levelData){
    levelData = JSON.parse(levelData);
    for (let i = 0; i < levelData.platforms.length; i++){
        const pack = levelData.platforms[i];
        pack.id = i;
        let platform = new entities.Platform(pack);
    }
    
    //if no spawnpoint is specified in the level data,
    //use a default config
    if (levelData.spawnpoints === undefined ||
      levelData.spawnpoints.length === 0){
        new entities.Spawnpoint({
            id: 0,
            x: 0,
            y: 0,
            spawnVel: {
                x: 0,
                y: 0
            }
        });
    }
    else{
        for (let i = 0; i < levelData.spawnpoints.length; i++){
            
            const pack = levelData.spawnpoints[i];
            pack.id = i;
            let spawn = new entities.Spawnpoint(pack);
        }
    }
}

module.exports = loadLevel;