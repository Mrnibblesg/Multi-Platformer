function addList(type){
    if (this.allLists[type] === undefined){
        this.allLists[type] = {};
    }
}
function addToList(type,item){
    this.allLists[type][item.id] = item;
}
function removeFromList(type,id){
    delete this.allLists[type][id];
}
function getList(type){
    return this.allLists[type];
}

exports.addList = addList;
exports.addToList = addToList;
exports.removeFromList = removeFromList;
exports.getList = getList;
exports.allLists = {};