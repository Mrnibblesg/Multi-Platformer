module.exports = {
    rand: function(max,min=0){
        return Math.random()*(max-min)+min;
    },
    chooseRand: function(a){
        return a[Math.floor(this.rand(a.length))];
    },
    min: function(a){
        if (a.length === 1){return a[0];}
        const min = a[0];
        for (const val of a)
            if (val < min){min=val;}
        return min;
    },
    max: function(a){
        if (a.length === 1){return a[0];}
        const max = a[0];
        for (const val of a)
            if (val > max){max=val;}
        return max;
    },
    average: function(a){
        let s = 0;
        for (const n of a)
            s += n;
        return s / a.length;
    },
    distance: function(p1,p2){
        const dx = p1.getX() - p2.getY();
        const dy = p1.getY() - p2.getY();
        return Math.sqrt(dx**2 + dy**2);
    },
    
    //Maps a value to a new minimum and maximum.
    //Ex: Mapping the value 15 from 10 - 20 to -5 - 5 would yield 0,
    //since 15 is halfway between 10 and 20, and 0 is halfway between -5 and 5.

    //Works even if val is outside min and max values.
    //Ex: scale(-1,   0, 1,  10, 20,) --> 0
    scale: function(val, oldmin,oldmax, newmin,newmax){
        const ratio = (val-oldmin) / (oldmax-oldmin);
        return ratio * (newmax-newmin) + newmin;
    },
    xor: function(a,b){
        return !(a === b);
    }
}








