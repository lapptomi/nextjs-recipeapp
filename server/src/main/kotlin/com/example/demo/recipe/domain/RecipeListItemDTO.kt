package com.example.demo.recipe.domain

import java.time.LocalDateTime

data class RecipeListItemDTO(
    val id: Int,
    val title: String,
    val description: String,
    val image: String? = null,
    val ingredients: List<String>,
    val cookingTime: Int,
    val servings: Int,
    val instructions: String,
    val author: RecipeAuthorDTO,
    val ratings: List<RecipeRating>,
    val createdAt: LocalDateTime,
)
