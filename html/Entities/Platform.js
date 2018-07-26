function Platform(initPack){
    Entity.call(this,initPack);
    this.w = initPack.w;
    this.h = initPack.h;
    this.col = 'black';
    
    this.draw = function(){
        screen.renderer.drawRect(this);
    }
    Platform.list[this.id] = this;
}
Platform.list = {};
Platform.drawAll = function(){
    for (let id in Platform.list){
        Platform.list[id].draw();
    }
}