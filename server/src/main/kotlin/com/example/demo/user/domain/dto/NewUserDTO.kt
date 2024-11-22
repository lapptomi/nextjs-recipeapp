package com.example.demo.user.domain.dto

data class CreateUserDTO(
    val username: String,
    val email: String,
    val password: String
)