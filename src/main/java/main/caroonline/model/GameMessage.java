package main.caroonline.model;

import org.apache.tomcat.jni.Time;

import java.sql.Timestamp;
import java.util.Date;

public class GameMessage {
    public String Type;
    public String Content;
    public int x;
    public int y;
    public int Turn;
    public int NextTurn;
    public long createAt;
    public GameMessage(){
        createAt = System.currentTimeMillis();
    }
}
