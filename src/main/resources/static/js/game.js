//const url = 'http://localhost:8080';
const url = 'https://caroonl.azurewebsites.net'
var stompClient = null;
var username = null;
var userId = null;
var roomName = null;
var roomId = null;
var roomCategory = "public"
var isHost = false;
var playerTurn,nextTurn=1;
var moved= false;
var started = false;
username = document.getElementById("username").textContent.trim();
roomName = document.querySelector('#roomname').innerText.trim();
roomCategory = document.querySelector('#roomcategory').innerText.trim();
isHost = document.querySelector('#isHost').innerText.trim();
roomId = document.querySelector('#roomId').innerText.trim();
userId = document.getElementById("userid").textContent.trim();

// timer

var isWaiting = false;
var isRunning = false;
var seconds = 30;
var countdownTimer;
var finalCountdown = false;

messArea = document.getElementById('chat-box');

function createGame(){
    if(isHost!=="True"){
        $.ajax({
            url: url + "/room/joinById",
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                UserID: userId,
                roomID: roomId
            }),
            success: function (data) {
                console.log(data);
                roomId = data.roomID;
                if(data.player3.userID !== ""){
                    playerTurn = 3;
                    userId = data.player3.userID;
                }
                else{
                    playerTurn = 2;
                    userId = data.player2.userID;
                }
                connectToGame();
                afterLoad();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }else {
        $.ajax({
            url: url + "/room/create",
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                roomName: roomName,
                roomCategory: roomCategory,
                creatorId: userId
            }),
            success: function (data) {
                // alert("Your created a game. Game id is: " + data.roomID);
                console.log(data);
                roomId = data.roomID;
                userId = data.player1.userID;
                connectToGame();
                afterLoad();
                playerTurn = 1;
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

function connectToGame() {
    console.log("connecting to the game"+roomId);
    let socket = new SockJS(url + "/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to the room: " + roomId);
        stompClient.subscribe("/chat/room/" + roomId, handleRespond)
    })
}

function sendMessage(e){
    e.preventDefault();
    $.ajax({
        url: url + "/room/chat",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            Sender: userId,
            RoomID: roomId,
            Content: document.getElementById('chat-input').value,
            type: 'CHAT'
        }),
        success: function (data) {
        },
        error: function (error) {
            console.log(error);
        }
    });
    document.getElementById('chat-input').value = "";
}

function leaveRoom(){
    $.ajax({
        url: url + "/room/leave",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            UserId: userId,
            RoomId: roomId
        }),
        success: function (data) {
            stompClient.unsubscribe();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function handleRespond(payload) {
    let message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.Type === 'JOIN') {
        messageElement.classList.add('event-message');
        if(document.getElementById('player2').innerHTML  === "" )
            document.getElementById('player2').innerHTML  = message.Sender;
        else if(document.getElementById('player3').innerHTML  === "" )
            document.getElementById('player3').innerHTML  = message.Sender;
        message.Content = message.Sender + ' joined!';
    } else if (message.Type === 'LEAVE') {
        messageElement.classList.add('event-message');
        if(document.getElementById('player2').innerHTML  === message.Sender )
            document.getElementById('player2').innerHTML  = "";
        else if(document.getElementById('player3').innerHTML  === message.Sender )
            document.getElementById('player3').innerHTML  = "";
        message.Content = message.Sender + ' left!';
    } else if(message.Type === "Start"){
        started = true;
        countdownTimer = setInterval(GameTimer, 1000);
    } else if(message.Type === "Move" && started === true){
        clearInterval(countdownTimer);
        let turn = message.Turn;
        var x = document.getElementById("board").rows[message.y].cells;
        nextTurn = message.NextTurn;
        if(turn===1){
            x[message.x].innerHTML = "X";
            x[message.x].style.color = "red";
        }else if (turn===2){
            x[message.x].innerHTML = "O";
            x[message.x].style.color = "lightblue";
        }else {
            x[message.x].innerHTML = "H";
            x[message.x].style.color = "yellow";
        }
        countdownTimer = setInterval(GameTimer, 1000);
    } if(message.Type === "Win" && started === true){
        clearInterval(countdownTimer);
        let turn = message.Turn;
        var x = document.getElementById("board").rows[message.y].cells;
        nextTurn = message.NextTurn;
        if(turn===1){
            x[message.x].innerHTML = "X";
            x[message.x].style.color = "red";
            alert("X is winner");
        }else if (turn===2){
            x[message.x].innerHTML = "O";
            x[message.x].style.color = "lightblue";
            alert("O is winner");
        }else {
            x[message.x].innerHTML = "H";
            x[message.x].style.color = "yellow";
            alert("H is winner");
        }
        started = false;
        countdownTimer = setInterval(GameTimer, 1000);
    } else {
        messageElement.classList.add('chat-message');
        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.Sender + ": ");
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('span');
    var messageText = document.createTextNode(message.Content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messArea.appendChild(messageElement);
    messArea.scrollTop = messArea.scrollHeight;
}

const chatForm = document.getElementById('chat-form');
    chatForm.addEventListener('submit',sendMessage);

function afterLoad(){
    document.getElementById("idbtn").title = roomId;
}
function copyRoomId() {
    navigator.clipboard.writeText(roomId);
}

// Game play function

function startGame(){
    $.ajax({
        url: url + "/room/start",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            userId: userId,
            roomId: roomId
        }),
        success: function (data) {
            console.log("Start game!");
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function pauseOrResumeGame(){

}
function makeMove(xx,yy){
    if(!started||playerTurn!==nextTurn)
        return;
    $.ajax({
        url: url + "/room/move",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            userId: userId,
            roomId: roomId,
            x : xx,
            y : yy
        }),
        success: function (data) {
            clearInterval(countdownTimer);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// Timer

function GameTimer() {
    var remainingSeconds = seconds % 60;
    document.getElementById('waiting_time').innerHTML = remainingSeconds;
    if (seconds === 0) {
        //makeMove((-1,-1));
        clearInterval(countdownTimer);
    } else {
        seconds--;
    }
}
