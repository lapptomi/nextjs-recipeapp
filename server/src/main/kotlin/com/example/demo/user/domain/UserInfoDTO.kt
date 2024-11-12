package com.example.demo.user.domain

data class UserDTO(
    val id: Int,
    val username: String,
    val email: String,
    val recipes: List<RecipeDTO> = listOf(),
)
