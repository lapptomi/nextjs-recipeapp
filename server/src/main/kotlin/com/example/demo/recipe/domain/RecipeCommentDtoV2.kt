package com.example.demo.recipe.domain

import com.example.demo.user.domain.RecipeAuthorDTO
import java.time.LocalDateTime

data class RecipeCommentDtoV2(
    val id: Int,
    val message: String,
    val author: RecipeAuthorDTO,
    val createdAt: LocalDateTime?,
)
