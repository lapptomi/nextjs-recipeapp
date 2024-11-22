package com.example.demo.user.domain.dto

import com.example.demo.user.domain.RecipeDTO

data class UserDTO(
    val id: Int,
    val username: String,
    val email: String,
    val recipes: List<RecipeDTO> = listOf(),
)
