package com.example.demo.recipe.domain

import java.time.LocalDateTime

data class RecipeListItemDTO(
    val id: Int,
    val title: String,
    val description: String,
    val image: String? = null,
    val cookingTime: Int,
    val servings: Int,
    val author: RecipeAuthorDTO,
    val averageRating: Double,
    val totalRatings: Int,
    val createdAt: LocalDateTime,
)
