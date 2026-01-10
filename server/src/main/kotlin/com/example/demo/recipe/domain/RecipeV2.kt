package com.example.demo.recipe.domain

import com.example.demo.user.domain.RecipeAuthorDTO
import java.time.LocalDateTime

data class RecipeV2(
    val id: Int,
    val title: String,
    val description: String,
    val image: String? = null,
    val ingredients: List<String>,
    val cookingTime: Int,
    val servings: Int,
    val instructions: String,
    val author: RecipeAuthorDTO,
    // val comments: List<RecipeComment>? = null,
    // val ratings: List<RecipeRating>? = null,
    val createdAt: LocalDateTime,
)
