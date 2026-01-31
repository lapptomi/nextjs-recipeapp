package com.example.demo.auth.domain

data class SocialLoginRequestDTO(val name: String, val email: String, val providerId: String, val provider: String)
