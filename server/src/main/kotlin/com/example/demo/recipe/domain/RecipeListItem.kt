package com.example.demo.recipe.domain

import java.time.LocalDateTime

data class RecipeListItem(
    val id: Int,
    val title: String,
    val description: String,
    val image: String?,
    val cookingTime: Int,
    val servings: Int,
    val category: String?,
    val userId: Int,
    val createdAt: LocalDateTime,
    val authorId: Int,
    val authorUsername: String,
    val averageRating: Double,
    val totalRatings: Int,
)
