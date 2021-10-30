package main.caroonline.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.caroonline.dto.ChatRequest;
import main.caroonline.dto.CreateRoomRequest;
import main.caroonline.dto.JoinRoomRequest;
import main.caroonline.model.ChatMessage;
import main.caroonline.model.Room;
import main.caroonline.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
public class WebSocketController {

    private final RoomService roomService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/room/left")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {

        return chatMessage;
    }

    @PostMapping("/room/join")
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
        c.type = "JOIN";
        simpMessagingTemplate.convertAndSend("/chat/room/" + request.roomID ,c);
        return ResponseEntity.ok(r);
    }

    @PostMapping("/room/create")
    public ResponseEntity<Room> createRoom(@RequestBody CreateRoomRequest request) {
        log.info("create room request: {}", request);
        return ResponseEntity.ok(roomService.CreateRoom(request));
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
}
