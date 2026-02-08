package com.example.demo.user.domain

import java.time.LocalDateTime

data class User(
    val id: Int,
    val image: String?,
    val username: String,
    val email: String,
    val password: String? = null,
    val bio: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
)
