package com.example.demo.recipe.domain

import java.time.LocalDateTime

data class RecipeDetail(
    val id: Int,
    val title: String,
    val description: String,
    val image: String?,
    val cookingTime: Int,
    val servings: Int,
    val instructions: String,
    val userId: Int,
    val createdAt: LocalDateTime,
    val category: String?,
    val author: RecipeAuthor,
    val ingredients: List<String>,
    val comments: List<RecipeComment>,
    val ratings: List<RecipeRating>,
)
