package com.example.demo.recipe.domain

import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import java.util.*

data class RecipeCommentV2(
    val id: Int,
    val message: String,
    val recipe: Recipe,
    val author: User,
    val createdAt: Date,
)
