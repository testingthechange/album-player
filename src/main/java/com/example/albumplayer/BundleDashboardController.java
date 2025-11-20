package com.example.albumplayer;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BundleDashboardController {

    // Instead of showing a page, redirect directly to the producer UI home
    @GetMapping("/dashboard")
    public String redirectToProducerPages() {
        return "redirect:/home";
    }
}
