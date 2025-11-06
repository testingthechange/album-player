package com.example.albumplayer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/", "/index.html", "/css/**", "/js/**", "/images/**", "/ping").permitAll()
        .anyRequest().permitAll()
      )
      .httpBasic(Customizer.withDefaults())
      .formLogin(login -> login.disable());
    return http.build();
  }
}
