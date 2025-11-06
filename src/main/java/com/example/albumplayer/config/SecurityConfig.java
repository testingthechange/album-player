package com.example.albumplayer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {
  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/", "/index.html", "/ping", "/css/**", "/js/**", "/images/**", "/h2-console/**").permitAll()
        .anyRequest().permitAll()
      )
      .headers(h -> h.frameOptions(f -> f.sameOrigin())); // required for H2 console
    return http.build();
  }
}
