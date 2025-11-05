package com.example.albumplayer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // disable CSRF for dev
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // allow all pages
            )
            .formLogin(login -> login.disable()); // disable login page
        return http.build();
    }
}
