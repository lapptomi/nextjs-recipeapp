package com.example.demo.openai.service

import com.example.demo.auth.service.AuthService
import com.example.demo.config.OpenAiProviderException
import com.example.demo.openai.domain.RecipeChatRequestDTO
import com.example.demo.openai.domain.RecipeChatResponseDTO
import com.example.demo.openai.domain.SaveGeneratedRecipeRequestDTO
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.recipe.service.RecipeService
import com.example.demo.s3.S3Service
import com.fasterxml.jackson.databind.ObjectMapper
import com.openai.client.OpenAIClient
import com.openai.errors.OpenAIServiceException
import com.openai.models.ChatModel
import com.openai.models.ReasoningEffort
import com.openai.models.chat.completions.ChatCompletionCreateParams
import com.openai.models.images.ImageGenerateParams
import com.openai.models.images.ImageModel
import java.util.Base64
import org.springframework.stereotype.Service

@Service
class OpenAiService(
    private val authService: AuthService,
    private val openAIClient: OpenAIClient,
    private val objectMapper: ObjectMapper,
    private val s3Service: S3Service,
    private val recipeService: RecipeService,
) {
    fun generateRecipeChatReply(request: RecipeChatRequestDTO): RecipeChatResponseDTO {
        // Check that the user is authenticated before processing the request
        authService.getCurrentUser()

        if (request.messages.isEmpty()) {
            throw OpenAiProviderException("Request must contain at least one message.")
        }

        val openAiRequestBuilder =
            ChatCompletionCreateParams.builder()
                .model(CHAT_MODEL)
                .reasoningEffort(ReasoningEffort.LOW)
                .maxCompletionTokens(1200)
                .addSystemMessage(SYSTEM_PROMPT)

        request.messages.forEach { message ->
            when (message.role.trim().lowercase()) {
                "assistant" -> openAiRequestBuilder.addAssistantMessage(message.content)
                else -> openAiRequestBuilder.addUserMessage(message.content)
            }
        }

        val completion = requestCompletion(openAiRequestBuilder.build())

        val rawContent =
            completion.choices().firstOrNull()?.message()?.content()?.orElse("")?.trim().takeUnless {
                it.isNullOrBlank()
            } ?: throw OpenAiProviderException("Model returned an empty response.")

        return parseResponse(rawContent)
    }

    fun saveGeneratedRecipe(request: SaveGeneratedRecipeRequestDTO): RecipeDTO {
        authService.getCurrentUser()

        val imageBytes = generateRecipeHeroImageFromRecipe(request)
        val imageName =
            try {
                s3Service.uploadBytes(imageBytes, extension = "png", contentType = "image/png")
            } catch (e: Exception) {
                throw OpenAiProviderException("Failed to upload generated image.", e)
            }

        val createRecipeDTO =
            CreateRecipeDTO(
                title = request.title.trim(),
                description = request.description.trim(),
                ingredients = request.ingredients.map { it.trim() }.filter { it.isNotEmpty() },
                cookingTime = request.cookingTime,
                servings = request.servings,
                instructions = request.instructions.map { it.trim() }.joinToString("\n"),
                category = request.category?.trim()?.takeIf { it.isNotEmpty() },
            )

        return recipeService.createRecipeWithImageName(createRecipeDTO, imageName)
    }

    private fun parseResponse(rawContent: String): RecipeChatResponseDTO {
        return try {
            val parsed = objectMapper.readValue(rawContent, RecipeChatResponseDTO::class.java)
            if (parsed.message.isBlank()) RecipeChatResponseDTO(message = rawContent) else parsed
        } catch (_: Exception) {
            RecipeChatResponseDTO(message = rawContent)
        }
    }

    private fun requestCompletion(params: ChatCompletionCreateParams) =
        try {
            openAIClient.chat().completions().create(params)
        } catch (e: OpenAIServiceException) {
            val reason =
                listOfNotNull(
                        "status=${e.statusCode()}",
                        e.code().orElse(null)?.let { "code=$it" },
                        e.param().orElse(null)?.let { "param=$it" },
                        e.type().orElse(null)?.let { "type=$it" },
                        e.message?.trim()?.takeIf { it.isNotEmpty() },
                    )
                    .joinToString(", ")
                    .ifEmpty { "Unknown provider error." }

            throw OpenAiProviderException("OpenAI request failed: $reason", e)
        } catch (e: Exception) {
            val reason = e.message?.trim().orEmpty().ifEmpty { "Unknown provider error." }
            throw OpenAiProviderException("OpenAI request failed: $reason", e)
        }

    private fun generateRecipeHeroImageFromRecipe(request: SaveGeneratedRecipeRequestDTO): ByteArray {
        return generateRecipeHeroImageFromPrompt(
            """
            Recipe title: ${request.title}
            Recipe description: ${request.description}
            """
                .trimIndent()
        )
    }

    private fun generateRecipeHeroImageFromPrompt(recipeContext: String): ByteArray {
        val imageResponse =
            try {
                openAIClient
                    .images()
                    .generate(
                        ImageGenerateParams.builder()
                            .model(IMAGE_MODEL)
                            .prompt(buildImagePrompt(recipeContext))
                            .size(ImageGenerateParams.Size._1536X1024)
                            .build()
                    )
            } catch (e: Exception) {
                val reason = e.message?.trim().orEmpty().ifEmpty { "Unknown provider error." }
                throw OpenAiProviderException("OpenAI image generation failed: $reason", e)
            }

        val imageBase64 =
            imageResponse.data().orElse(emptyList()).firstOrNull()?.b64Json()?.orElse(null)?.trim().takeUnless {
                it.isNullOrBlank()
            } ?: throw OpenAiProviderException("OpenAI image response did not contain image data.")

        return try {
            Base64.getDecoder().decode(imageBase64)
        } catch (e: Exception) {
            throw OpenAiProviderException("Failed to decode generated image.", e)
        }
    }

    private fun buildImagePrompt(recipeContext: String): String =
        """
        Create a hero image for a recipe page.
        The image must look delicious, realistic, and visually striking.
        Recipe context:
        $recipeContext
        Style: natural warm lighting, rich realistic textures.
        Composition: hero-banner friendly framing, balanced background, shallow depth of field.
        Food appeal: fresh-looking ingredients, glossy sauces when appropriate, visible moisture/juiciness,
        subtle steam for hot dishes, crisp edges, and restaurant-quality plating.
        Camera feel: slight 3/4 angle close-up, sharp focus on the main bite area, soft bokeh background.
        Keep parts of the background clean so UI title/buttons can be overlaid without visual clutter.
        Color direction: vibrant but natural food colors, strong contrast, restaurant-quality presentation.
        Avoid dull, flat, or washed-out tones.
        Constraints: no people, no hands, no faces, no text, no logos, no watermark, no collage, so only images of recipes and food related things.
        """
            .trimIndent()

    companion object {
        private val CHAT_MODEL = ChatModel.GPT_5_MINI
        private val IMAGE_MODEL = ImageModel.GPT_IMAGE_1_MINI

        private val SYSTEM_PROMPT =
            """
            You are an AI recipe assistant for a social cooking app.
            Users may ask questions, request recipes, or request adjustments.
            You have access to the full conversation history — it is important to use it when adjusting or referencing previous recipes.

            Return ONLY a valid JSON object. No markdown, no code fences, no extra text.
            Omit the "recipe" key entirely when no recipe is being returned — do not set it to null.

            Use exactly this shape:
            {
              "message": "string",
              "recipe": {
                "title": "string",
                "description": "string",
                "cookingTime": 30,
                "servings": 2,
                "difficulty": "Easy",
                "ingredients": ["200g pasta", "2 cloves garlic", "optional: fresh basil for serving"],
                "instructions": ["Boil water.", "Cook pasta for 10 minutes."],
                "tags": ["Italian", "Quick"],
                "adjustments": ["Simpler version", "Double serving", "Make vegan", "Spicier version"]
              }
            }

            Rules:
            - Always include "message".
            - Include "recipe" ONLY when user intent is recipe creation or recipe modification.
            - Apply a safety gate before the first recipe in a conversation:
              ask a neutral, open-ended question about allergies, dietary restrictions, intolerances, and ingredient avoidances.
            - While the safety gate is unresolved, return only "message" and do not include "recipe".
            - Consider safety confirmed only after explicit user confirmation of either no restrictions or listed restrictions.
            - Once safety is confirmed in the conversation, do not ask again unless the user changes constraints.
            - If the request is underspecified, ask a concise clarifying question instead of guessing.
            - If the request is clear and safety is confirmed, generate the recipe immediately.
            - For recipe changes, use full updated output (not diffs) and keep edits limited to requested changes.
            - Do not ask about kitchen equipment. Assume stovetop and oven unless the user states otherwise.

            Realism and feasibility:
            - The user is not always right. Do not follow impossible or unsafe requests.
            - If a request is unrealistic (e.g., "cook chicken in 3 minutes"), say it is not realistic and propose a feasible alternative.
            - Never claim impossible food prep/cook outcomes as valid.
            - Keep recipes practical for home cooking with believable ingredients, steps, and timing.
            - Respect constraints (diet/allergies/time). If constraints conflict, explain briefly and suggest the closest feasible version.
            - Be realistic, but still creative with recipes. So don't always generate the same recipes, so try to generate different types of recipes.

            Recipe quality and format:
            - "difficulty" must be exactly one of: "Easy", "Medium", "Hard".
            - "cookingTime" is in minutes and must be a number.
            - "servings" must be a number.
            - "ingredients", "instructions", "tags", and "adjustments" must be arrays of strings.
            - In "ingredients", prefix non-essential items (garnishes/toppings/serving extras) with "optional: ".
              Example: "optional: fresh basil for serving".
            - When a recipe is included, make it complete:
              - instructions: use clear steps
              - tags: 2-6 useful tags
              - adjustments: 4-5 recipe-specific suggestions, each 2-4 words.
            - Always include "Simpler version" in "adjustments".
            - Prefer including "Double serving" unless it is clearly not useful for the current recipe context.
            - Include "Make vegan" when the current recipe is not vegan and a vegan adaptation is realistic.
            - "adjustments" must be relevant to the specific recipe, not generic filler.
            - Do not include adjustments that are already true for the recipe.
              Example: if the recipe is already gluten-free, do not include "Gluten free";
              if the recipe is already vegan, do not include "Make vegan".
            - Avoid duplicate or near-duplicate adjustments.

            Message style:
            - Keep "message" short (1-2 sentences), clear, and aligned with the latest user request.
            - Use a friendly, happy, and upbeat tone while staying concise and practical.
            - Use smiling emojis only in suitable spots, like a real person naturally would.
              Do not force emojis; skip them when they do not fit the context or intent.
              If used, keep it to 0-1 emoji (e.g., 🙂 😊 😄).
            - Sound conversational, supportive, and human; avoid robotic or formulaic phrasing.
            - Be direct and honest when rejecting unrealistic requests.
            - Avoid directive language. Prefer neutral questions, options, and suggestions.
            """
                .trimIndent()
    }
}
