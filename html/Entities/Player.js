function Player(initPack){
    Entity.call(this,initPack);
    this.username = initPack.username;
    this.w = initPack.w;
    this.h = initPack.h;
    this.col = initPack.col;
    
    this.draw = function(){
        
        c.beginPath();
        c.fillStyle = this.col;
        c.strokeStyle = 'black';
        c.rect(this.x,this.y,this.w,this.h);
        c.fill();
        c.stroke();
        c.closePath();
        
        c.beginPath();
        c.fillStyle = 'black';
        c.font = '15px Antic';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(this.username,this.x + this.w/2, this.y - this.h / 3);
        c.closePath();
    }
    Player.list[this.id] = this;
}
Player.list = {};

Player.drawAll = function(){
    for (let id in Player.list){
        Player.list[id].draw();
    }
}