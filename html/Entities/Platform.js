class Platform extends Rect{
    constructor(pack){
        super(pack);
        listManager.addToList('platforms',this);
    }
    draw(){
        screen.renderer.drawRect(this);
    }
    static drawAll(){
        let list = listManager['platforms'];
        for (let id in list){
            list[id].draw();
        }
    }
}