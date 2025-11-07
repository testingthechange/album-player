package com.example.albumplayer.cms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DirectusClient {
  private final RestTemplate http = new RestTemplate();
  @Value("${directus.url}")   private String base;
  @Value("${directus.token:}") private String token; // optional if public

  public String get(String pathAndQuery) {
    String url = base + (pathAndQuery.startsWith("/") ? pathAndQuery : "/" + pathAndQuery);
    HttpHeaders h = new HttpHeaders();
    if (!token.isBlank()) h.setBearerAuth(token);
    h.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
    return http.exchange(url, HttpMethod.GET, new HttpEntity<>(h), String.class).getBody();
  }
}
