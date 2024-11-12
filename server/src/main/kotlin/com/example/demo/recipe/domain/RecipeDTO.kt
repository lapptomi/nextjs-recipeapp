package com.example.demo.user.domain

import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.recipecomment.RecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.RecipeRatingDTO
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
    val comments: List<RecipeCommentDTO>,
    val ratings: List<RecipeRatingDTO>,
)