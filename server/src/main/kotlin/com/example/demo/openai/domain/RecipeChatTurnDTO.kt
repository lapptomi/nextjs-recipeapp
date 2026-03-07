package com.example.demo.openai.domain

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class RecipeChatTurnDTO(
    val role: RecipeChatRole = RecipeChatRole.USER,
    val content: String = "",
    val recipe: GeneratedRecipeDTO? = null,
)
