package com.example.demo.auth.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import org.springframework.stereotype.Service
import java.util.*

@Service
class JwtService {
    private val SECRET_KEY = Jwts.SIG.HS512.key().build()
    private val JWT_EXPIRATION = 60 * 60 * 1000 // Expires in 1 hour

    private fun getAllClaims(token: String): Claims = Jwts.parser()
        .verifyWith(SECRET_KEY)
        .build()
        .parseSignedClaims(token)
        .payload

    fun extractEmail(token: String): String = getAllClaims(token).subject

    fun validateToken(token: String, email: String): Boolean = email == getAllClaims(token).subject

    fun generateToken(email: String): String = Jwts.builder()
        .claims()
        .subject(email)
        .issuedAt(Date(System.currentTimeMillis()))
        .expiration(Date(System.currentTimeMillis() + JWT_EXPIRATION))
        .and()
        .signWith(SECRET_KEY)
        .compact()

}