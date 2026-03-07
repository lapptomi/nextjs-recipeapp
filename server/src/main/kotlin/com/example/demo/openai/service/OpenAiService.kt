package com.example.demo.openai.service

import com.example.demo.auth.service.AuthService
import com.example.demo.config.OpenAiException
import com.example.demo.openai.domain.RecipeChatRequestDTO
import com.example.demo.openai.domain.RecipeChatResponseDTO
import com.example.demo.openai.domain.RecipeChatRole
import com.example.demo.openai.domain.RecipeChatTurnDTO
import com.fasterxml.jackson.databind.ObjectMapper
import com.openai.client.OpenAIClient
import com.openai.models.ChatModel
import com.openai.models.ReasoningEffort
import com.openai.models.chat.completions.ChatCompletionCreateParams
import org.springframework.stereotype.Service

@Service
class OpenAiService(
    private val authService: AuthService,
    private val openAIClient: OpenAIClient,
    private val objectMapper: ObjectMapper,
) {
    fun generateRecipeChatReply(request: RecipeChatRequestDTO): RecipeChatResponseDTO {
        // Check that the user is authenticated before processing the request
        authService.getCurrentUser()

        if (request.messages.isEmpty()) {
            throw OpenAiException("Request must contain at least one message.")
        }

        val openAiRequestBuilder =
            ChatCompletionCreateParams.builder()
                .model(CHAT_MODEL)
                .reasoningEffort(ReasoningEffort.LOW)
                .maxCompletionTokens(1200)
                .addSystemMessage(RECIPE_CHAT_SYSTEM_PROMPT)

        request.messages.forEach { message ->
            when (message.role) {
                RecipeChatRole.ASSISTANT -> openAiRequestBuilder.addAssistantMessage(serializeConversationTurn(message))
                RecipeChatRole.USER -> openAiRequestBuilder.addUserMessage(message.content)
            }
        }

        val completion = requestCompletion(openAiRequestBuilder.build())

        val rawContent =
            completion.choices().firstOrNull()?.message()?.content()?.orElse("")?.trim().takeUnless {
                it.isNullOrBlank()
            } ?: throw OpenAiException("Model returned an empty response.")

        return parseResponse(rawContent)
    }

    private fun parseResponse(rawContent: String): RecipeChatResponseDTO {
        return try {
            val parsed = objectMapper.readValue(rawContent, RecipeChatResponseDTO::class.java)
            if (parsed.message.isBlank()) RecipeChatResponseDTO(message = rawContent) else parsed
        } catch (_: Exception) {
            RecipeChatResponseDTO(message = rawContent)
        }
    }

    private fun serializeConversationTurn(message: RecipeChatTurnDTO): String {
        if (message.recipe == null) {
            return message.content
        }

        return try {
            objectMapper.writeValueAsString(mapOf("message" to message.content, "recipe" to message.recipe))
        } catch (e: Exception) {
            throw OpenAiException("Failed to serialize conversation turn.", e)
        }
    }

    private fun requestCompletion(params: ChatCompletionCreateParams) =
        try {
            openAIClient.chat().completions().create(params)
        } catch (e: Exception) {
            throw OpenAiException("OpenAI request failed.", e)
        }

    companion object {
        private val CHAT_MODEL = ChatModel.GPT_5_MINI
    }
}
