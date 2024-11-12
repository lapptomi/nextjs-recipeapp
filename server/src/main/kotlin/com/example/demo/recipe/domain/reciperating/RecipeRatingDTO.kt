package com.example.demo.recipe.domain.reciperating

import com.example.demo.recipe.domain.RecipeAuthorDTO

data class RecipeRatingDTO(
    val author: RecipeAuthorDTO,
    val type: RecipeRatingType,
)
