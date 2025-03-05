package com.example.demo.auth.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import java.util.Date
import org.springframework.stereotype.Service

@Service
class JwtService {
    private val secretKey = Jwts.SIG.HS512.key().build()

    private val jwtExpiration = 60 * 60 * 1000 // Expires in 1 hour

    private fun getAllClaims(token: String): Claims =
        Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).payload

    fun extractEmail(token: String): String = getAllClaims(token).subject

    fun validateToken(token: String, email: String): Boolean = email == getAllClaims(token).subject

    fun generateToken(email: String): String =
        Jwts.builder()
            .claims()
            .subject(email)
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + jwtExpiration))
            .and()
            .signWith(secretKey)
            .compact()
}
