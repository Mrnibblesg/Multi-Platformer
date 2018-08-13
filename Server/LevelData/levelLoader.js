const fs = require('fs');
const entities = require('../Constructors/Entities');
const packManager = require('../Engine/packManager');
const listManager = require('../Engine/listManager');
function loadLevel(name){
    const path = './Server/LevelData/' + name;
    
    fs.readFile(path, 'utf8', (err, data) => {
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
        packManager.addInit('platforms',platform.initPack);
    }
    
}

module.exports = loadLevel;