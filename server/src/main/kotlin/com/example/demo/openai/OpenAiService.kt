package com.example.demo.openai

import com.example.demo.config.OpenAiException
import com.example.demo.openai.domain.RecipeChatRequestDTO
import com.example.demo.openai.domain.RecipeChatResponseDTO
import com.example.demo.openai.domain.RecipeChatRole
import com.example.demo.openai.domain.RecipeChatTurnDTO
import com.example.demo.recipe.domain.Recipe
import com.example.demo.s3.S3Service
import com.fasterxml.jackson.databind.ObjectMapper
import com.openai.client.OpenAIClient
import com.openai.models.ChatModel
import com.openai.models.ReasoningEffort
import com.openai.models.chat.completions.ChatCompletionCreateParams
import com.openai.models.images.ImageGenerateParams
import com.openai.models.images.ImageModel
import java.util.Base64
import org.springframework.stereotype.Service

@Service
class OpenAiService(
    private val openAIClient: OpenAIClient,
    private val objectMapper: ObjectMapper,
    private val s3Service: S3Service,
) {
    fun generateRecipeChatReply(request: RecipeChatRequestDTO): RecipeChatResponseDTO {
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

    fun generateRecipeImage(recipe: Recipe, ingredients: List<String>): String =
        try {
            val params =
                ImageGenerateParams.builder()
                    .model(IMAGE_MODEL)
                    .prompt(buildImagePrompt(recipe, ingredients))
                    .size(ImageGenerateParams.Size._1536X1024)
                    .quality(ImageGenerateParams.Quality.MEDIUM)
                    .outputFormat(ImageGenerateParams.OutputFormat.PNG)
                    .build()

            val b64 = openAIClient.images().generate(params).data().get().first().b64Json().get()

            s3Service.uploadBytes(Base64.getDecoder().decode(b64), extension = "png", contentType = "image/png")
        } catch (e: Exception) {
            throw OpenAiException("OpenAI image generation failed.", e)
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

    private fun buildImagePrompt(recipe: Recipe, ingredients: List<String>) =
        """
        Create a realistic hero image for a recipe page.

        Recipe title: ${recipe.title}
        Recipe description: ${recipe.description}
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
