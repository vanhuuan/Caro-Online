package main.caroonline.model;

public class Board {
    private static short size = 20;

    public int[][] getBoard() {
        return board;
    }

    public void setBoard(int[][] board) {
        this.board = board;
    }

    public void SetPoint(int x, int y,int turn){
        board[x][y] = turn;
    }

    public boolean isEnd(int x,int y,int turn){
        int streak = 0;
        for (int i = 0;i<5;i++){ // Duong phia bac
            if (board[x][y+i] != turn) {
                streak = 0;
                break;
            }else {
                streak++;
                if (streak==5)
                    return true;
            }
        }
        for (int i = 0;i<5;i++){ // duong phia nam
            if (board[x][y-i] != turn) {
                streak = 0;
                break;
            }else {
                streak++;
                if (streak==5)
                    return true;
            }
        }
        for (int i = 0;i<5;i++){ // duong phia dong
            if (board[x+i][y] != turn) {
                streak = 0;
                break;
            }else {
                streak++;
                if (streak==5)
                    return true;
            }
        }
        for (int i = 0;i<5;i++){ // duong phia tay
            if (board[x-i][y] != turn) {
                streak = 0;
                break;
            }else {
                streak++;
                if (streak==5)
                    return true;
            }
        }
        for (int i = 0;i<5;i++){ // duong phia dong bac
            if (board[x+i][y+i] != turn) {
                streak = 0;
                break;
            }else {
                streak++;
                if (streak==5)
                    return true;
            }
        }
        for (int i = 0;i<5;i++){ // duong phia dong nam
            if (board[x+i][y-i] != turn) {
                streak = 0;
                break;
            }else {
                streak++;
                if (streak==5)
                    return true;
            }
        }
        for (int i = 0;i<5;i++){ // duong phia tay bac
            if (board[x-i][y+i] != turn) {
                streak = 0;
                break;
            }else {
                streak++;
                if (streak==5)
                    return true;
            }
        }
        for (int i = 0;i<5;i++){ // duong phia tay nam
            if (board[x-i][y-i] != turn) {
                streak = 0;
                break;
            }else {
                streak++;
                if (streak==5)
                    return true;
            }
        }
        return false;
    }

    private int board[][];
    public Board(){
        board = new int[size][size];
        for (int i = 0;i<20;i++){
            for (int j=0;j<20;j++){
                board[i][j] = 0;
            }
        }
    }
}
