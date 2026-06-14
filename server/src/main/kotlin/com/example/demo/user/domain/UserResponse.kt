package com.example.demo.user.domain

import com.example.demo.recipe.domain.RecipeListItemResponse

data class UserResponse(
    val id: Int,
    val username: String,
    val email: String,
    val image: String? = null,
    val createdAt: String,
    val bio: String? = null,
    val recipes: List<RecipeListItemResponse>? = emptyList(),
)
