function Player(initPack){
    Entity.call(this,initPack);
    this.username = initPack.username;
    this.w = initPack.w;
    this.h = initPack.h;
    this.col = initPack.col;
    this.stroke = 'black';
    
    this.getCenter = function(){
        return {x: this.x + this.w/2,y: this.y + this.h/2};
    }
    
    this.draw = function(){
        
        screen.renderer.drawRect(this);
        
        c.beginPath();
        c.fillStyle = 'black';
        c.font = '15px Antic';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        //Just a patch job until I make a text object
        c.fillText(this.username,W/2, H/2 - this.h/2 - 10);
        //c.fillText(this.username,this.x + this.w/2, this.y - this.h / 3);
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