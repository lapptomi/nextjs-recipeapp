package com.example.demo.user.domain

import java.time.LocalDateTime

data class User(
    val id: Int,
    val username: String,
    val email: String,
    val password: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
)
