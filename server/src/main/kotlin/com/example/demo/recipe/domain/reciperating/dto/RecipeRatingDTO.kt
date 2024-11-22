package com.example.demo.recipe.domain.reciperating.dto

import com.example.demo.recipe.domain.dto.RecipeAuthorDTO
import com.example.demo.recipe.domain.reciperating.RecipeRatingType

data class RecipeRatingDTO(
    val author: RecipeAuthorDTO,
    val type: RecipeRatingType,
)
