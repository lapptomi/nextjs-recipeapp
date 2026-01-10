package com.example.demo.recipe.domain

import com.example.demo.recipe.domain.reciperating.RecipeRatingType
import com.example.demo.user.domain.RecipeAuthorDTO

data class RecipeRatingDtoV2(val id: Int, val type: RecipeRatingType, val author: RecipeAuthorDTO)
