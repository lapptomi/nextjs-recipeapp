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
            .expiration(Date(System.currentTimeMillis() + 60 * 60 * 1000)) // Expires in 1 hour
            .and()
            .signWith(getSecretKey())
            .compact()
}
