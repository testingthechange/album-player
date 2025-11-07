package com.example.albumplayer.web;

import com.example.albumplayer.cms.PromptService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PromptController {
  private final PromptService svc;
  public PromptController(PromptService svc){ this.svc = svc; }

  @GetMapping(value="/api/prompts", produces=MediaType.APPLICATION_JSON_VALUE)
  public String list(){ return svc.listJson(); }
}
