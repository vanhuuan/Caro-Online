const url = 'http://localhost:8080';
var stompClient = null;
var username = null;
var userId = null;
var roomName = null;
var roomId = null;
var roomCategory = "public"
var isHost = false;
username = document.querySelector('#username').innerText.trim();
roomName = document.querySelector('#roomname').innerText.trim();
roomCategory = document.querySelector('#roomcategory').innerText.trim();

function enterRoom(){
    $.ajax({
        url: url + "/room/create",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "roomName": roomName,
            "roomCategory": roomCategory,
            "creatorName": username
        }),
        success: function (data) {
            alert("Your created a game. Game id is: " + data.roomID);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
createGame();