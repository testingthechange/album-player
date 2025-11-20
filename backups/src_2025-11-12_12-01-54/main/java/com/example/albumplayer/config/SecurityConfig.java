package com.example.albumplayer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // Turn off CSRF for now while developing
            .csrf(csrf -> csrf.disable())

            // 🚨 DEVELOPMENT MODE: allow EVERYTHING without login
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            // Login/logout still exist but won't be required
            .formLogin(form -> form
                .permitAll()
            )
            .logout(logout -> logout
                .permitAll()
            );

        return http.build();
    }
}


