package com.example.demo.openai.domain

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

data class SaveGeneratedRecipeRequestDTO(
    @field:NotBlank val title: String,
    val description: String = "",
    @field:NotEmpty val ingredients: List<String>,
    @field:NotEmpty val instructions: List<String>,
    @field:Min(1) val cookingTime: Int,
    @field:Min(1) val servings: Int,
    val category: String? = null,
)
