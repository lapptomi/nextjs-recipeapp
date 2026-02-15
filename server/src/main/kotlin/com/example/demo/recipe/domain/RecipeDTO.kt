package com.example.demo.recipe.domain

import java.time.LocalDateTime

data class RecipeDTO(
    val id: Int,
    val title: String,
    val description: String,
    val image: String?,
    val ingredients: List<String>,
    val cookingTime: Int,
    val servings: Int,
    val instructions: String,
    val author: RecipeAuthorDTO,
    val createdAt: LocalDateTime,
    val comments: List<RecipeComment> = emptyList(),
    val ratings: List<RecipeRating> = emptyList(),
    val category: String?,
)
