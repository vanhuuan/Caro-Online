package main.caroonline.dto;

public class RoomInfoResponse {

    private String roomId;

    private String roomName;

    private int memberInRoom;



    public RoomInfoResponse() {
    }

    public RoomInfoResponse(String roomId, String roomName, int memberInRoom) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.memberInRoom = memberInRoom;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public int getMemberInRoom() {
        return memberInRoom;
    }

    public void setMemberInRoom(int memberInRoom) {
        this.memberInRoom = memberInRoom;
    }
}
