package com.example.demo.user.domain

data class RecipeDTO(
    var title: String,
    var description: String,
    var ingredients: List<String>,
    var cookingTime: Int,
    var servings: Int,
    var instructions: String
)