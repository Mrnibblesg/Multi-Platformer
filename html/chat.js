let chatForm = document.getElementById('chat-form');
let chatInput = document.getElementById('chat-input');
let chatText = document.getElementById('chat-text');

chatForm.onsubmit = function(e){
    e.preventDefault();
    if (chatInput.value === ''){return;}
    if (chatInput.value[0] === '/'){
        socket.emit('eval',chatInput.value.substring(1));
    }
    else{
        socket.emit('chatMsgSend',{username: Player.list[selfId].getUsername(), message: chatInput.value});
    }
    
    chatInput.value = '';
}

socket.on('chatMsgReceive', function(text){
    const username = '<span id="' + text.username + '">' + text.username + '</span>';
    const msg = ': ' + text.message;
    chatText.innerHTML += '<div><p>' + username + msg + '</p></div>';
});

document.oncontextmenu = function(e){
    e.preventDefault();
}