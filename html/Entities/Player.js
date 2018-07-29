function Player(initPack){
    Entity.call(this,initPack);
    Rect.call(this,initPack);
    this.text = new Text({
        msg: initPack.username,
        font: '15px Antic',
        col: 'black'
    });
    this.stroke = 'black';
    
    this.getCenter = function(){
        return {x: this.getX() + this.w/2,y: this.getY() + this.h/2};
    }
    this.getUsername = function(){
        return this.text.msg;
    }
    
    this.draw = function(){
        screen.renderer.drawRect(this);
        
        this.text.follow(this,{x: this.w/2, y: -10});
        screen.renderer.drawText(this.text);
    }
    Player.list[this.id] = this;
}
Player.list = {};

Player.drawAll = function(){
    for (let id in Player.list){
        Player.list[id].draw();
    }
}