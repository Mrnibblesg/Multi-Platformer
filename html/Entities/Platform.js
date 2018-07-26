function Platform(initPack){
    this.id = initPack.id;
    this.x = initPack.x;
    this.y = initPack.y;
    this.w = initPack.w;
    this.h = initPack.h;
    this.col = 'black';
    
    this.draw = function(){
        c.beginPath();
        c.fillStyle = this.col;
        c.strokeStyle = 'white';
        c.rect(this.x,this.y,this.w,this.h);
        c.fill();
        c.stroke();
        c.closePath();
    }
    Platform.list[this.id] = this;
}
Platform.list = {};
Platform.drawAll = function(){
    for (let id in Platform.list){
        Platform.list[id].draw();
    }
}