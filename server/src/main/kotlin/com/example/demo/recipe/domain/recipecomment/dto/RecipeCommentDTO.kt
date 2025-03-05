package com.example.demo.recipe.domain.recipecomment.dto

import com.example.demo.recipe.domain.dto.RecipeAuthorDTO

data class RecipeCommentDTO(
    val author: RecipeAuthorDTO,
    val message: String,
    val createdAt: String,
)
