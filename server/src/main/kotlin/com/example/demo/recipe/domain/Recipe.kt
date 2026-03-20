package com.example.demo.recipe.domain

import java.time.LocalDateTime

data class Recipe(
    val id: Int,
    val title: String,
    val description: String,
    val image: String? = null,
    val cookingTime: Int,
    val servings: Int,
    val instructions: String,
    val userId: Int,
    val createdAt: LocalDateTime,
    val category: String?,
)
