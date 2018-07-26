let divUsername = document.getElementById('divUsername');
let divGame = document.getElementById('divGame');

let btnUsername = document.getElementById('btnUsername');
let inputUsername = document.getElementById('inputUsername');
let formUsername = document.getElementById('formUsername');

let textResult = document.getElementById('textResult');


btnUsername.onclick = function(e){
    e.preventDefault();
    socket.emit('signIn',{username: inputUsername.value});
}

socket.on('signInResponse', function(data){
    textResult.innerHTML = data.message;
    if (data.success){
        divUsername.style.display = 'none';
        divGame.style.display = 'inline-block';
        startGame();
    }
    else{
        inputUsername.value = '';
    }
});