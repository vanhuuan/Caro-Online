package main.caroonline.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.caroonline.dto.*;
import main.caroonline.model.ChatMessage;
import main.caroonline.model.GameMessage;
import main.caroonline.model.Room;
import main.caroonline.service.GameService;
import main.caroonline.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
public class GameController {

    private final RoomService roomService;
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/room/Leave")
    public void leaveRoom(@RequestBody LeftRoomRequest request) {
        log.info("leave room request: {}", request.RoomId);
        boolean rs = roomService.leaveRoom(request);
        if (rs){
            var c = new ChatMessage();
            c.RoomID=request.RoomId;
            c.Type = "LEAVE";
            c.Sender = roomService.GetUserById(request.UserId).getName();
            c.Content = " leave!";
            simpMessagingTemplate.convertAndSend("/chat/room/" + request.RoomId ,c);
        }else {
            System.out.println("Khong xoa duoc");
        }
    }

    @PostMapping("/room/joinById")
    public ResponseEntity<Room> joinRoom(@RequestBody JoinRoomRequest request) {
        log.info("join room request: {}", request.UserID);
        var c = new ChatMessage();
        c.RoomID = request.roomID;
        var r = roomService.JoinRoom(request);
        if(r.getPlayer1().getUserID().compareTo(request.UserID)==0){
            c.Sender = r.getPlayer1().getName();
        }else if (r.getPlayer2().getUserID().compareTo(request.UserID)==0) {
            c.Sender = r.getPlayer2().getName();
        }else {
            c.Sender = r.getPlayer3().getName();
        }
        c.Content = "join!";
        c.Type = "JOIN";
        simpMessagingTemplate.convertAndSend("/chat/room/" + request.roomID ,c);
        return ResponseEntity.ok(r);
    }

    @PostMapping("/room/create")
    public ResponseEntity<Room> createRoom(@RequestBody CreateRoomRequest request) {
        log.info("create room request: {}", request);
        var r = roomService.CreateRoom(request);
        return ResponseEntity.ok(r);
    }
    @PostMapping("/room/chat")
    public void chat(@RequestBody ChatMessage chatMessage) {
        log.info("chat request: {}", chatMessage.Content);
        var r = roomService.GetRoomById(chatMessage.RoomID);
        System.out.println(r.getPlayer1().getUserID()+chatMessage.Sender);
        System.out.println(r.getPlayer2().getUserID()+chatMessage.Sender);
        if(r.getPlayer1().getUserID().compareTo(chatMessage.Sender)==0){
            chatMessage.Sender = r.getPlayer1().getName();
            log.info("sender1 :" + r.getPlayer1().getName());
        }else if (r.getPlayer2().getUserID().compareTo(chatMessage.Sender)==0) {
            chatMessage.Sender = r.getPlayer2().getName();
            log.info("sender2 :" +r.getPlayer2().getName());
        }else {
            chatMessage.Sender = r.getPlayer3().getName();
            log.info("sender3 :" +r.getPlayer3().getName());
        }
        simpMessagingTemplate.convertAndSend("/chat/room/" + chatMessage.RoomID , chatMessage);
    }

    @PostMapping("/room/move")
    public void makeMove(@RequestBody MoveRequest request) {
        var Response = gameService.MakeMove(request);
        System.out.println(request.roomId);
        if (Response != null){
            GameMessage message = new GameMessage();
            message.Type = Response.nextTurn!=-1? "Move" : "Win";
            message.Content = Response.nextTurn!=-1? "Move" : "Win";
            message.x = request.x;
            message.y = request.y;
            message.Turn = Response.turn;
            message.NextTurn = Response.nextTurn;
            simpMessagingTemplate.convertAndSend("/chat/room/" + request.roomId , message);
        }
    }
    @PostMapping("/room/start")
    public void startGame(@RequestBody StartGameRequest request) {
        var Check = gameService.StartGame(request);
        if (Check){
            GameMessage message = new GameMessage();
            message.Type = "Start";
            message.Content = "Game started";
            simpMessagingTemplate.convertAndSend("/chat/room/" + request.roomId , message);
        }
    }
    @PostMapping("/room/resume")
    public void pauseAndResumeGame(@RequestBody PauseAndResumeRequest request) {
        var Check = gameService.PauseAndResume(request);
        var room = roomService.GetRoomById(request.roomId);
        if (Check){
            GameMessage message = new GameMessage();
            if(room.getState().equals("Paused"))
                message.Type = "Pause";
            else  message.Type = "Resume";
            message.Content = "Game "+message.Type+"d";
            simpMessagingTemplate.convertAndSend("/chat/room/" + request.roomId , message);
        }
    }
}
