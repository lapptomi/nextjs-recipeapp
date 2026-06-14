package com.example.demo.openai.domain

data class RecipeChatRequest(val messages: List<RecipeChatTurn> = emptyList())
