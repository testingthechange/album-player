package com.example.albumplayer.cms;

import org.springframework.stereotype.Service;

@Service
public class PromptService {
  private final DirectusClient directus;
  public PromptService(DirectusClient directus){ this.directus = directus; }

  public String listJson(){
    return directus.get("/items/ai_prompts?filter[status][_eq]=published&sort=name");
  }
}
