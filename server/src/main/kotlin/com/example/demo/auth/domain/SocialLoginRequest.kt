package com.example.demo.auth.domain

data class SocialLoginRequest(
    val name: String,
    val email: String,
    val providerId: String,
    val provider: String,
    val image: String?,
)
