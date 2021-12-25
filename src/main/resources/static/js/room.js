const url = 'http://localhost:8080';
//const url = 'https://caroonl.azurewebsites.net'

$(document).ready(function(){
    const searchButton = document.querySelector("#searchRoomButton");
    searchButton.addEventListener("click", function () {
        const roomId = $('#roomId').val();
        getRoomInfo(roomId);
        $('#confirmModal').modal('show');
    });

    function getRoomInfo(roomId){
        $.ajax({
            url: url + "/room/private/" + roomId + "/info",
            type: 'GET',
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                $("#roomFoundInfo").text("Do you want to join " + data.roomName + "?");
                $("#noRoomFound").addClass('hide');
                $('#foundRoom').removeClass("hide");
                $('#confirmJoinButton').removeAttr("disabled");
                $("#privateRoomId").val(data.roomId);
            },
            error: function () {
                $("#foundRoom").addClass('hide');
                $("#noRoomFound").removeClass("hide");
                $('#confirmJoinButton').attr("disabled", true);
            }
        });
    }
});