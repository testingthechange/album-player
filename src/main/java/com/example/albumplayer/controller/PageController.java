package com.example.albumplayer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/home")
    public String home() {
        return "home"; // maps to home.html
    }

    @GetMapping("/producer")
    public String producer() {
        return "producer"; // maps to producer.html
    }

    @GetMapping("/song")
    public String song() {
        return "song"; // maps to song.html
    }

    @GetMapping("/meta")
    public String meta() {
        return "meta"; // maps to meta.html
    }
}
