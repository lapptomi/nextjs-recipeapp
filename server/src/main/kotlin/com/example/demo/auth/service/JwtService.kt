package com.example.demo.auth.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.util.*

@Service
class JwtService {
    private val secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512)
    private val JWT_EXPIRATION = 1000 * 60 * 60 * 10 // 10 hours

    private fun getAllClaims(token: String): Claims {
        val parser = Jwts.parser().verifyWith(secretKey).build()
        return parser.parseSignedClaims(token).payload
    }

    fun extractEmail(token: String): String = getAllClaims(token).subject

    fun validateToken(token: String, email: String): Boolean {
        return email == getAllClaims(token).subject
    }

    fun generateToken(email: String): String {
        return Jwts.builder()
            .claims()
            .subject(email)
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + JWT_EXPIRATION))
            .and()
            .signWith(secretKey)
            .compact()
    }
}