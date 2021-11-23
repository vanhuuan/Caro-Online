package main.caroonline.service;

import lombok.AllArgsConstructor;
import main.caroonline.dto.MoveRequest;
import main.caroonline.dto.MoveResponse;
import main.caroonline.dto.PauseAndResumeRequest;
import main.caroonline.dto.StartGameRequest;
import main.caroonline.storage.AppStorage;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GameService {
    public boolean StartGame(StartGameRequest request){
        var room = AppStorage.getInstance().getRoomByID(request.roomId);
        if (room.getState().equals("Ready") && room.getTurn().equals(request.userId)) {
            room.setState("Playing");
            return true;
        }
        return false;
    }
    public boolean PauseAndResume(PauseAndResumeRequest request){
        var room = AppStorage.getInstance().getRoomByID(request.roomId);
        if (room.getState().equals("Paused") && room.getTurn().equals(request.userId)) {
            room.setState("Playing");
            return true;
        }else if (room.getState().equals("Playing") && room.getTurn().equals(request.userId)) {
            room.setState("Paused");
            return true;
        }
        return false;
    }
    public MoveResponse MakeMove(MoveRequest request){
        var room = AppStorage.getInstance().getRoomByID(request.roomId.trim());
        if (room!=null){
            if (room.getTurn().equals(request.userId)){
                MoveResponse response = new MoveResponse();
                boolean check = false;
                if(room.getPlayer1().getUserID().equals(request.userId)){
                    check = room.getBoard().SetPoint(request.x,request.y,1);
                    response.turn = 1;
                    response.nextTurn = 2;
                    room.setTurn(room.getPlayer2().getUserID());
                }
                else if(room.getPlayer2().getUserID().equals(request.userId)){
                    room.getBoard().SetPoint(request.x,request.y,2);
                    response.turn = 2;
                    if(!room.getPlayer3().getUserID().equals("")){
                        response.nextTurn = 3;
                        room.setTurn(room.getPlayer3().getUserID());
                    }
                    else{
                        room.setTurn(room.getPlayer1().getUserID());
                        response.nextTurn = 1;
                    }
                }
                else if(room.getPlayer3().getUserID().equals(request.userId)){
                    room.getBoard().SetPoint(request.x,request.y,3);
                    response.turn = 3;
                    response.nextTurn = 1;
                    room.setTurn(room.getPlayer1().getUserID());
                }
                if(check) response.nextTurn=-1;
                return response;
            }
        }
        return null;
    }
}
