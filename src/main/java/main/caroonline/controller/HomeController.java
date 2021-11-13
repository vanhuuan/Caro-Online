package main.caroonline.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.caroonline.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;


@Controller
@Slf4j
@AllArgsConstructor
public class HomeController {

    private final RoomService roomService;

    private static final Logger LOGGER = LoggerFactory.getLogger(HomeController.class);

    @GetMapping(value = {"/", "/index"})
    public String homePage() {
        return "index";
    }

    @RequestMapping(value = "/sharedRoom", method = RequestMethod.POST, params = "join")
    public String joinRoom(@RequestParam("name") String playerName, RedirectAttributes redirectAttributes) throws IOException {
        LOGGER.info("User [{}] has find a new game room.", playerName);
        redirectAttributes.addFlashAttribute("playerName", playerName);
        return "redirect:/room";
    }

    @RequestMapping(value = "/sharedRoom", method = RequestMethod.POST, params = "create")
    public ModelAndView createRoom(@RequestParam("name") String playerName, @RequestParam("room-name") String roomName, @RequestParam("room-kind") String roomCategory) {
        LOGGER.info("User [{}] has create new game room", playerName);
        System.out.println(playerName + roomName + roomCategory);
        return gamePage(playerName, roomName, roomCategory);
    }

    @RequestMapping(value = "/sharedRoom", method = RequestMethod.POST, params = "play")
    public String quickPlay(String playerName) {
        return "redirect:/game";
    }

    @GetMapping(value = "/room")
    public ModelAndView roomPage(@ModelAttribute("playerName") String playerName) {
        ModelAndView model = new ModelAndView();
        model.setViewName("room");
        var uid = roomService.JoinPublicUserList(playerName);
        model.addObject("userID", uid.getUserID());
        model.addObject("publicRooms", this.roomService.getPublicRoom());
        return model;
    }

    @RequestMapping(value = "/game/create", method = RequestMethod.POST)
    public ModelAndView gamePage(String playerName, String roomName, String roomCategory) {
        ModelAndView model = new ModelAndView();
        model.setViewName("game");
        model.addObject("name", playerName);
        model.addObject("roomName", roomName);
        model.addObject("roomCategory", roomCategory);
        model.addObject("isHost", "True");
        return model;
    }

    @RequestMapping(value = "/game/join", method = RequestMethod.POST)
    public ModelAndView gamePage(@RequestParam(name = "playerId") String playerId, @RequestParam(name = "roomId") String roomId) {
        ModelAndView model = new ModelAndView();
        model.setViewName("game");
        System.out.println(playerId + " . . " + roomId);
        String player2 = "";
        String player3 = "";
        var u = roomService.GetUserById(playerId);
        var r = roomService.GetRoomById(roomId);
        model.addObject("name", u.getName());
        model.addObject("userId", u.getUserID());
        model.addObject("roomName", r.getRoomName());
        model.addObject("roomCategory", r.getRoomCategory());
        model.addObject("roomId", roomId);
        model.addObject("isHost", "False");
        if (r.getPlayer1().getName() != "") {
            if (player2.compareTo("") == 0) {
                player2 = r.getPlayer1().getName();
                model.addObject("player2", player2);
            } else if (player3.compareTo("") == 0) {
                player3 = r.getPlayer1().getName();
                model.addObject("player3", player3);
            }
        }
        if (r.getPlayer2().getName() != "") {
            if (player2.compareTo("") == 0) {
                player2 = r.getPlayer2().getName();
                model.addObject("player2", player2);
            } else if (player3.compareTo("") == 0) {
                player3 = r.getPlayer2().getName();
                model.addObject("player3", player3);
            }
        }
        if (r.getPlayer3().getName() != "") {
            if (player2.compareTo("") == 0) {
                player2 = r.getPlayer3().getName();
                model.addObject("player2", player2);
            } else if (player3.compareTo("") == 0) {
                player3 = r.getPlayer3().getName();
                model.addObject("player3", player3);
            }
        }
        return model;
    }
}
