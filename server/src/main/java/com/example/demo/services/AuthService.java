package com.example.demo.services;

import com.example.demo.dto.JwtTokenDTO;
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

    public JwtTokenDTO getUserByToken(String bearerToken) {
        try {
            String token = bearerToken.substring(7);
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET)
                    .parseClaimsJws(token)
                    .getBody();

            String userEmail = claims.getSubject();
            return new JwtTokenDTO(userEmail, claims.getExpiration());
        } catch (Exception e) {
            throw new RuntimeException("Invalid or missing token");
        }
    }
}
