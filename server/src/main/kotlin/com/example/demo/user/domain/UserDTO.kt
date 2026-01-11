package com.example.demo.user.domain

import com.example.demo.recipe.domain.RecipeDTO

data class UserDTO(
    val id: Int,
    val username: String,
    val email: String,
    val recipes: List<RecipeDTO>? = emptyList(),
)
