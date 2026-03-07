package com.example.demo.openai.service

import com.example.demo.config.OpenAiException
import com.example.demo.recipe.domain.Recipe
import com.example.demo.s3.S3Service
import com.openai.client.OpenAIClient
import com.openai.models.images.ImageGenerateParams
import com.openai.models.images.ImageModel
import java.util.Base64
import org.springframework.stereotype.Service

@Service
class OpenAiImageService(private val openAIClient: OpenAIClient, private val s3Service: S3Service) {
    fun generateRecipeImage(recipe: Recipe): String {
        val imageBase64 =
            try {
                openAIClient
                    .images()
                    .generate(
                        ImageGenerateParams.builder()
                            .model(IMAGE_MODEL)
                            .prompt(buildImagePrompt(recipe))
                            .size(ImageGenerateParams.Size._1536X1024)
                            .build()
                    )
                    .data()
                    .orElse(emptyList())
                    .firstOrNull()
                    ?.b64Json()
                    ?.orElse(null)
                    ?.trim()
                    .takeUnless { it.isNullOrBlank() }
                    ?: throw OpenAiException("OpenAI image response did not contain image data.")
            } catch (e: OpenAiException) {
                throw e
            } catch (e: Exception) {
                throw OpenAiException("OpenAI image generation failed.", e)
            }

        val imageBytes =
            try {
                Base64.getDecoder().decode(imageBase64)
            } catch (e: Exception) {
                throw OpenAiException("Failed to decode generated image.", e)
            }

        return try {
            s3Service.uploadBytes(imageBytes, extension = "png", contentType = "image/png")
        } catch (e: Exception) {
            throw OpenAiException("Failed to upload generated image.", e)
        }
    }

    private fun buildImagePrompt(recipe: Recipe): String =
        """
        Create a realistic hero image for a recipe page.

        Recipe title: ${recipe.title}
        Recipe description: ${recipe.description}
        Ingredients: ${recipe.ingredients.joinToString(", ")}

        Style:
        - natural warm lighting
        - rich realistic textures
        - shallow depth of field
        - restaurant-quality plating
        - appetizing and believable home-cooking presentation

        Composition:
        - hero-banner friendly framing
        - clean background areas for UI overlays
        - close-up 3/4 angle
        - focus on the dish, not props

        Constraints:
        - no people
        - no hands
        - no text
        - no logos
        - no watermark
        - no collage
        """
            .trimIndent()

    companion object {
        private val IMAGE_MODEL = ImageModel.GPT_IMAGE_1_MINI
    }
}
