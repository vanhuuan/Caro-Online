package main.caroonline.storage;

import main.caroonline.model.Room;
import main.caroonline.model.User;

import java.util.HashMap;
import java.util.Map;

public class AppStorage {
    private static Map<String, Room> rooms;
    private static Map<String, User> users;
    private static AppStorage instance;

    private AppStorage() {
        rooms = new HashMap<>();
        users = new HashMap<>();
    }

    public static synchronized AppStorage getInstance() {
        if (instance == null) {
            instance = new AppStorage();
        }
        return instance;
    }

    public Map<String, Room> getGames() {
        return rooms;
    }

    public void setGame(Room room) {
        rooms.put(room.getRoomID(), room);
    }

    public Room getRoomByID(String id){
        return rooms.get(id);
    }
    public void removeRoom(String id){ rooms.remove(id);}

    public Map<String, User> getUsers() {
        return users;
    }

    public void setUsers(User user) {
        users.put(user.getUserID(), user);
    }
    public User getUserByID(String id){
        return users.get(id);
    }
}
