//const url = 'http://localhost:8080';
const url = 'https://caro-online.azurewebsites.net'
var stompClient = null;
var username = null;
var userId = null;
var roomName = null;
var roomId = null;
var roomCategory = "public"
var isHost = false;
username = document.getElementById("username").textContent.trim();
roomName = document.querySelector('#roomname').innerText.trim();
roomCategory = document.querySelector('#roomcategory').innerText.trim();
isHost = document.querySelector('#isHost').innerText.trim();
roomId = document.querySelector('#roomId').innerText.trim();
userId = document.getElementById("userid").textContent.trim();

messArea = document.getElementById('chat-box');

function createGame(){
    if(isHost!=="True"){
        $.ajax({
            url: url + "/room/join",
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
                if(data.player3.userID !== "")
                    userId = data.player3.userID;
                else
                    userId = data.player2.userID;
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
                creatorName: username
            }),
            success: function (data) {
                // alert("Your created a game. Game id is: " + data.roomID);
                console.log(data);
                roomId = data.roomID;
                userId = data.player1.userID;
                connectToGame();
                afterLoad();
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
createGame()

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

function handleRespond(payload) {
    let message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        if(document.getElementById('player2').innerHTML  === "" )
            document.getElementById('player2').innerHTML  = message.Sender;
        else if(document.getElementById('player3').innerHTML  === "" )
            document.getElementById('player3').innerHTML  = message.Sender;
        message.Content = message.Sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.Content = message.Sender + ' left!';
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
