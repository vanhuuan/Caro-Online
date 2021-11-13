package main.caroonline.listener;

import main.caroonline.dto.LeftRoomRequest;
import main.caroonline.model.ChatMessage;
import main.caroonline.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations simpMessagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new web socket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        logger.info("Disconnect to websocket");
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String user_rome = (String) headerAccessor.getSessionAttributes().get("user_room");
        if(user_rome != null) {
            var roomService = new RoomService();
            var info = user_rome.split(":");
            var request = new LeftRoomRequest();
            request.RoomId = info[1];
            request.UserId = info[0];
            boolean rs = roomService.leaveRoom(request);
            if (rs){
                var c = new ChatMessage();
                c.RoomID= info[1];
                c.Type = "LEAVE";
                c.Sender = roomService.GetUserById(info[0]).getName();
                c.Content = " leave!";
                simpMessagingTemplate.convertAndSend("/chat/room/" + info[1] ,c);
            }else {
                System.out.println("Khong xoa duoc");
            }
        }
    }

}
