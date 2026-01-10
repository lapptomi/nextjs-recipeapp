package com.example.demo.recipe.domain

import com.example.demo.recipe.domain.reciperating.RecipeRatingType
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User

data class RecipeRatingV2(
    val id: Int,
    val type: RecipeRatingType,
    val recipe: Recipe,
    val author: User,
)
