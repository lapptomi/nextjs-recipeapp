package com.example.demo.openai.domain

data class RecipeImageRequest(
    val title: String = "",
    val description: String = "",
    val ingredients: List<String> = emptyList(),
)
