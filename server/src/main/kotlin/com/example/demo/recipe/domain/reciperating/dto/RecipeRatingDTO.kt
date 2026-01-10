package com.example.demo.recipe.domain.reciperating.dto

import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.reciperating.RecipeRatingType

data class RecipeRatingDTO(val author: RecipeAuthorDTO, val type: RecipeRatingType)
