package com.example.demo.openai.domain

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class RecipeChatResponseDTO(val message: String = "", val recipe: GeneratedRecipeDTO? = null)
