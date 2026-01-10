package com.example.demo.recipe.domain

import com.example.demo.user.domain.RecipeAuthorDTO
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
    val comments: List<RecipeCommentDtoV2> = emptyList(),
    val ratings: List<RecipeRatingDtoV2> = emptyList(),
)
