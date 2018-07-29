function setControls(){
    document.onkeydown = function(event){
        const key = String.fromCharCode(event.keyCode);
        socket.emit('keyPress',{inputId: key, state: true});
        
    }
    document.onkeyup = function(event){
        const key = String.fromCharCode(event.keyCode);
        socket.emit('keyPress',{inputId: key, state: false});
        
    }
}
