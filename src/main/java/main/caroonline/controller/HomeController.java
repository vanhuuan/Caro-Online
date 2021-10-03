package main.caroonline.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {
    @GetMapping(value = "/")
    public String homePage() {
        return "index";
    }

    @RequestMapping(value = "/sharedRoom", method = RequestMethod.POST, params = "join")
    public String joinRoom(String playerName, String roomID) {
        return "redirect:/room";
    }

    @RequestMapping(value = "/sharedRoom", method = RequestMethod.POST, params = "create")
    public String createRoom(String playerName) {
        return "redirect:/game";
    }

    @RequestMapping(value = "/sharedRoom", method = RequestMethod.POST, params = "play")
    public String quickPlay(String playerName) {
        return "redirect:/game";
    }

    @GetMapping(value = "/room")
    public ModelAndView roomPage() {
        ModelAndView model = new ModelAndView();
        model.setViewName("room");
        return model;
    }
    @GetMapping(value = "/game")
    public ModelAndView gamePage() {
        ModelAndView model = new ModelAndView();
        model.setViewName("game");
        return model;
    }
}
