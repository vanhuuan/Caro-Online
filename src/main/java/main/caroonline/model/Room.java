package main.caroonline.model;

public class Room {
    private String roomID;

    public String getRoomID() {
        return roomID;
    }

    public void setRoomID(String roomID) {
        this.roomID = roomID;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getRoomCategory() {
        return roomCategory;
    }

    public void setRoomCategory(String roomCategory) {
        this.roomCategory = roomCategory;
    }

    public User getPlayer1() {
        return player1;
    }

    public void setPlayer1(User player1) {
        this.player1 = player1;
    }

    public User getPlayer2() {
        return player2;
    }

    public void setPlayer2(User player2) {
        this.player2 = player2;
    }

    public User getPlayer3() {
        return player3;
    }

    public void setPlayer3(User player3) {
        this.player3 = player3;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }
    public void setState(String state){
        this.state= state;
    }
    public String getState(){
        return  state;
    }
    public void setTurn(String turn){
        this.turn = turn;
    }
    public String getTurn(){
        return turn;
    }
    private String roomName;
    private String roomCategory;
    private User player1;
    private User player2;
    private User player3;
    private Board board;
    private String state;
    private String turn;
    public int getNumOfPlayer() {
        return numOfPlayer;
    }
    public void setNumOfPlayer(int numOfPlayer) {
        this.numOfPlayer = numOfPlayer;
    }
    private int numOfPlayer;
    public Room(){
        player1 = new User();
        player1.setUserID("");
        player1.setName("");
        player3 = new User();
        player3.setUserID("");
        player3.setName("");
        player2 = new User();
        player2.setUserID("");
        player2.setName("");
        board = new Board();
        state = "Ready";
        numOfPlayer = 1;
    }
}
