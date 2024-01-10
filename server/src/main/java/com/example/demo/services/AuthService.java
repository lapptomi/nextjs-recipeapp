package com.example.demo.services;

import com.example.demo.dto.LoginDTO;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final String SECRET = "secretkey";

    @Autowired
    UserRepository userRepository;

    private String generateToken(String email) {
        return Jwts.builder()
            .setSubject(email)
            .setExpiration(new Date(System.currentTimeMillis() + 864_000_000)) // 10 days
            .signWith(SignatureAlgorithm.HS512, SECRET)
            .compact();
    }

    public String generateToken(LoginDTO credentials) {
        User user = userRepository.findByEmail(credentials.getEmail()).orElseThrow();

        if (!user.getPassword().equals(credentials.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return this.generateToken(credentials.getEmail());
    }

    public Claims getUserByToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            // Handle token decoding exceptions, e.g., expired token, invalid signature, etc.
            // You may want to log the exception or handle it according to your requirements.
            return null;
        }
    }
}
