package com.example.demo.auth.domain

data class JwtTokenDto(
    val token: String,
    val email: String,
    val username: String,
    val userId: Int
)
