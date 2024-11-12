package com.example.demo.recipe.domain.recipecomment

import com.example.demo.recipe.domain.RecipeAuthorDTO

data class RecipeCommentDTO(
    val author: RecipeAuthorDTO,
    val message: String,
    val createdAt: String
)