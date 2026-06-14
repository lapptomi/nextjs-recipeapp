package com.example.demo.openai.domain

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class RecipeChatResponse(val message: String = "", val recipe: GeneratedRecipeResponse? = null)
