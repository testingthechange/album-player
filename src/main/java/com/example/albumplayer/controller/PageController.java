package com.example.albumplayer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/home")
    public String home() {
        // Renders src/main/resources/templates/home.html
        return "home";
    }

    @GetMapping("/song")
    public String song() {
        // Renders src/main/resources/templates/song.html
        return "song";
    }

    @GetMapping("/meta")
    public String meta() {
        // Renders src/main/resources/templates/meta.html
        return "meta";
    }
}

