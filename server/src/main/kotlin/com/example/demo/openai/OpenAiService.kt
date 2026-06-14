package com.example.demo.openai

import com.example.demo.config.OpenAiException
import com.example.demo.openai.domain.RecipeChatRequest
import com.example.demo.openai.domain.RecipeChatResponse
import com.example.demo.openai.domain.RecipeChatRole
import com.example.demo.openai.domain.RecipeChatTurn
import com.fasterxml.jackson.databind.ObjectMapper
import com.openai.client.OpenAIClient
import com.openai.models.ChatModel
import com.openai.models.ReasoningEffort
import com.openai.models.chat.completions.ChatCompletionCreateParams
import com.openai.models.images.ImageGenerateParams
import com.openai.models.images.ImageModel
import org.springframework.stereotype.Service

@Service
class OpenAiService(private val openAIClient: OpenAIClient, private val objectMapper: ObjectMapper) {
    fun generateRecipeChatReply(request: RecipeChatRequest): RecipeChatResponse {
        if (request.messages.isEmpty()) {
            throw OpenAiException("Request must contain at least one message.")
        }

        val openAiRequestBuilder =
            ChatCompletionCreateParams.builder()
                .model(CHAT_MODEL)
                .reasoningEffort(ReasoningEffort.LOW)
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

    fun generateRecipeImage(recipeTitle: String, recipeDescription: String, ingredients: List<String>): String {
        try {
            val params =
                ImageGenerateParams.builder()
                    .model(IMAGE_MODEL)
                    .prompt(buildImagePrompt(recipeTitle, recipeDescription, ingredients))
                    .size(ImageGenerateParams.Size._1536X1024)
                    .quality(ImageGenerateParams.Quality.MEDIUM)
                    .outputFormat(ImageGenerateParams.OutputFormat.PNG)
                    .build()

            val b64 = openAIClient.images().generate(params).data().get().first().b64Json().get()
            return b64
        } catch (e: Exception) {
            throw OpenAiException("OpenAI image generation failed.", e)
        }
    }

    private fun parseResponse(rawContent: String): RecipeChatResponse {
        return try {
            val parsed = objectMapper.readValue(rawContent, RecipeChatResponse::class.java)
            if (parsed.message.isBlank()) RecipeChatResponse(message = rawContent) else parsed
        } catch (_: Exception) {
            RecipeChatResponse(message = rawContent)
        }
    }

    private fun serializeConversationTurn(message: RecipeChatTurn): String {
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

    private fun buildImagePrompt(recipeTitle: String, recipeDescription: String, ingredients: List<String>) =
        """
        Create a realistic hero image for a recipe page.

        Recipe title: $recipeTitle
        Recipe description: $recipeDescription
        Ingredients: ${ingredients.joinToString(", ")}

        Style:
        - natural warm lighting
        - rich realistic textures
        - shallow depth of field
        - restaurant-quality plating
        - appetizing and believable home-cooking presentation

        Composition:
        - hero-banner friendly framing
        - clean background areas for UI overlays

        Constraints:
        - no people
        - no hands
        - no text
        - no logos
        - no watermark
        - no collage
        - only recipe and food related things in the image
        """
            .trimIndent()

    companion object {
        private val CHAT_MODEL = ChatModel.GPT_5_MINI
        private val IMAGE_MODEL = ImageModel.GPT_IMAGE_1_MINI
    }
}
