package com.example.caroonline.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {
    @GetMapping( value = "/")
    public String homePage() {
        return "landing";
    }
    @RequestMapping( value = "/sharedRoom", method = RequestMethod.POST, params = "join-room")
    public String sharedListRoomsPage(String userName){
        return "redirect:/ListRooms";
    }
    @RequestMapping(value = "/sharedRoom", method = RequestMethod.POST,params = "create-room")
    public String sharedRoomPage(String roomName,String userName){
        return "redirect:/Room";
    }
    @GetMapping( value = "/ListRooms")
    public ModelAndView listRoomsPage(String userName){
        ModelAndView model = new ModelAndView();
        model.setViewName("listRoom");
        return model;
    }
    @GetMapping( value = "/Room")
    public ModelAndView roomPage(String roomName,String userName){
        ModelAndView model = new ModelAndView();
        model.setViewName("room");
        return model;
    }
}
