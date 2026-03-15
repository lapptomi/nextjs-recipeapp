package com.example.demo.openai.domain

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class GeneratedRecipeDTO(
    val title: String = "",
    val description: String = "",
    val cookingTime: Int = 0,
    val servings: Int = 0,
    val difficulty: String = "",
    val category: String = "",
    val ingredients: List<String> = emptyList(),
    val instructions: List<String> = emptyList(),
    val adjustments: List<String> = emptyList(),
)
