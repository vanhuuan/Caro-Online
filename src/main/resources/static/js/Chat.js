'use strict';


var messageForm = document.querySelector('#chat-form');
var messageInput = document.querySelector('#chat-input');
var messageArea = document.querySelector('#chat-box');
var connectingElement = document.querySelector('#connecting');

var stompClient = null;
var username = null;
var userId = null;
var roomName = null;
var roomId = null;
var roomCategory = "public"
var isHost = false;


function connect() {
    username = document.querySelector('#username').innerText.trim();
    roomName = document.querySelector('#roomname').innerText.trim();
    roomCategory = document.querySelector('#roomcategory').innerText.trim();

    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
}

// Connect to WebSocket Server.
connect();

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/roomService', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/room.Create",
        {},
        JSON.stringify({})
    )

}


function onError(error) {

}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');
        var usernameElement = document.createElement('strong');
        usernameElement.classList.add('nickname');
        var usernameText = document.createTextNode(message.sender+": ");
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('span');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


messageForm.addEventListener('submit', sendMessage, true);