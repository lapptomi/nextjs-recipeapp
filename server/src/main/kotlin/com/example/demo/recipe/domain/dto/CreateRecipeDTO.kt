package com.example.demo.recipe.domain.dto

data class CreateRecipeDTO(
    val title: String,
    val description: String,
    val ingredients: List<String>,
    val cookingTime: Int,
    val servings: Int,
    val instructions: String,
)
