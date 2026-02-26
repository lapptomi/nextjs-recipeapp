package com.example.demo.openai.domain

data class RecipeChatRequestDTO(val messages: List<RecipeChatTurnDTO> = emptyList())
