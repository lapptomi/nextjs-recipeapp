package com.example.demo.recipe.domain

data class CreateRecipeRequest(
    val title: String,
    val description: String,
    val ingredients: List<String>,
    val cookingTime: Int,
    val servings: Int,
    val instructions: String,
    val category: String?,
)
