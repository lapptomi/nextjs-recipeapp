package com.example.demo.recipe.domain

import java.time.LocalDateTime

data class RecipeComment(val id: Int, val message: String, val author: RecipeAuthorDTO, val createdAt: LocalDateTime?)
