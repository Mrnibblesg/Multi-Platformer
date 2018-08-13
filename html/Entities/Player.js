class Player extends Rect{
    constructor(pack){
        
        super(pack);
        
        this.text = new Text({
            msg: pack.username,
            font: '15px Antic',
            col: 'black'
        });
        this.stroke = 'black';
        listManager.addToList('players',this);
    }
    draw(){
        screen.renderer.drawRect(this);
        
        this.text.follow(this,{x: this.w/2, y: -10});
        screen.renderer.drawText(this.text);
    }
    get center(){
        return {x: this.x + this.w/2,y: this.y + this.h/2};
    }
    get username(){
        return this.text.msg;
    }
    static drawAll(){
        const list = listManager['players'];
        for (let id in list){
            list[id].draw()
        }
    }
}