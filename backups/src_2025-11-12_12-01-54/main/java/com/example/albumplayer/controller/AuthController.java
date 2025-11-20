package com.example.albumplayer.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.albumplayer.model.User;
import com.example.albumplayer.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/verify")
    public Map<String, Object> verifyToken(@RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        try {
            String token = payload.get("didToken"); // frontend sends this
            DecodedJWT jwt = JWT.decode(token);

            String issuer = jwt.getIssuer();   // wallet address
            String subject = jwt.getSubject(); // user email/ID

            // Save or update user
            User user = userRepository.findByEmail(subject)
                    .orElse(new User());
            user.setEmail(subject);
            user.setWalletAddress(issuer);
            userRepository.save(user);

            response.put("success", true);
            response.put("issuer", issuer);
            response.put("subject", subject);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return response;
    }
}
