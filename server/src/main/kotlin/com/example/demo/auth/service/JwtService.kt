package com.example.demo.auth.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import java.util.Date
import javax.crypto.SecretKey
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class JwtService(@Value("\${jwt.secret}") private val jwtSecret: String) {
    fun getSecretKey(): SecretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret))

    fun generateToken(userId: Int): String =
        Jwts.builder()
            .claims()
            .subject(userId.toString())
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + 60 * 30 * 1000)) // Expires in 30 minutes
            .and()
            .signWith(getSecretKey())
            .compact()

    fun generateRefreshToken(userId: Int): String =
        Jwts.builder()
            .claims()
            .subject(userId.toString())
            .add("type", "refresh")
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000)) // Expires in 30 days
            .and()
            .signWith(getSecretKey())
            .compact()

    fun parseRefreshToken(token: String): Int {
        val claims = Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).payload
        require(claims["type"] == "refresh") { "Not a refresh token" }
        return claims.subject.toInt()
    }
}
