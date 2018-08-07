const entities = require('../Constructors/Entities');
function getAllUpdatePack(){
    let pack = {};
    pack.players = entities.Player.getAllUpdatePack();
    //only thing that needs to update right now is the players
    return pack;
}
function addInit(type,pack){
    this.initPack[type].push(pack);
}
function addRemove(type,pack){
    this.removePack[type].push(pack);
}
function resetPacks(){
    this.initPack = {players: [], platforms: []};
    this.removePack = {players: [], platforms: []};
}

exports.getAllUpdatePack = getAllUpdatePack;
exports.addInit = addInit;
exports.addRemove = addRemove;
exports.resetPacks = resetPacks;

exports.initPack = {players: [], platforms: []};
exports.removePack = {players: [], platforms: []};