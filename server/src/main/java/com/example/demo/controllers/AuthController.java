package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginDTO;
import com.example.demo.services.AuthService;

import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> generateToken(@RequestBody LoginDTO credentials) {
        return ResponseEntity.ok(authService.generateToken(credentials));
    }
    
    @GetMapping("/me")
    public ResponseEntity<Claims> getUserByToken(@RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.substring(7);
        return ResponseEntity.ok(authService.getUserByToken(token));
    }
}
