package com.example.demo.openai.domain

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue

enum class RecipeChatRole(@get:JsonValue val value: String) {
    USER("user"),
    ASSISTANT("assistant");

    companion object {
        @JvmStatic
        @JsonCreator
        fun fromValue(value: String): RecipeChatRole =
            entries.firstOrNull { it.value.equals(value.trim(), ignoreCase = true) }
                ?: throw IllegalArgumentException("Unsupported chat role: $value")
    }
}
