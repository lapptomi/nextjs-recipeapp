package com.example.demo.domain

import java.time.Instant

data class CurrentUser(
    val exp: Instant, // Expiration time
    val sub: Int, // Subject (user ID)
    val iat: Instant, // Issued at time
)
