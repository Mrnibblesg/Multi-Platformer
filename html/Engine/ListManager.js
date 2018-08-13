let listManager = {
    addList: function(type){
        this[type] = {};
    },
    addToList: function(type,item){
        this[type][item.id] = item;
    },
    removeFromList: function(type,id){
        delete this[type][id];
    }
}