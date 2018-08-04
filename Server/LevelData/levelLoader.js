const fs = require('fs');
const entities = require('../Constructors/Entities');
function loadLevel(name,initPack){
    const path = './Server/LevelData/' + name;
    
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {throw err;}
        doneLoading(data,initPack);
    });
}
function doneLoading(levelData,initPack){
    levelData = JSON.parse(levelData);
    for (let i = 0; i < levelData.platforms.length; i++){
        const pack = levelData.platforms[i];
        pack.id = i;
        new entities.Platform(pack);
    }
    initPack.platforms = entities.Platform.getAllInitPack();
}


module.exports = loadLevel;