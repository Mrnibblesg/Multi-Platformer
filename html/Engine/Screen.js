let screen = {
    x: 0,
    y: 0,
    w: W,
    h: H,
    
    //Instantly sets the center.
    //Obj must have at least an x and y.
    centerOn: function(obj){
        let center = this.getObjCenter(obj);
        if (center === undefined){return;}
        
        this.x = center.x - this.w/2;
        this.y = center.y - this.h/2;
        
    },
    getObjCenter: function(obj){
        if (typeof obj === 'undefined'){
            console.error('obj is undefined.');
            return undefined;
        }
        let centerX, centerY;
        if (typeof obj.getCenter === 'function'){
            const center = obj.getCenter();
            centerX = center.x;
            centerY = center.y;
        }
        else if (typeof obj.x === 'number' && typeof obj.y === 'number'){
            centerX = obj.x;
            centerY = obj.y;
        }
        else{
            console.error(`Tried to center on invalid object: ${obj}`);
            return undefined;
        }
        return {x:centerX, y:centerY};
    },
    getCenter: function(){
        return {x: this.x + this.w/2, y: this.y + this.h/2};
    }
}
screen.renderer = {
    drawRect: function(rect){
        c.beginPath();
        c.fillStyle = rect.col;
        c.strokeStyle = rect.stroke;
        c.rect(rect.x - screen.x, rect.y - screen.y, rect.w, rect.h);
        c.fill();
        c.stroke();
        c.closePath();
    }
    
}