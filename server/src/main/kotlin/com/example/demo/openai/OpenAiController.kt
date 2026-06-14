package com.example.demo.openai

import com.example.demo.ApiPath
import com.example.demo.openai.domain.RecipeChatRequest
import com.example.demo.openai.domain.RecipeChatResponse
import com.example.demo.openai.domain.RecipeImageRequest
import com.example.demo.openai.domain.RecipeImageResponse
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(ApiPath.OPENAI_API)
class OpenAiController(private val openAiService: OpenAiService) {

    @PostMapping("/recipe-chat")
    fun recipeChat(@Valid @RequestBody request: RecipeChatRequest): ResponseEntity<RecipeChatResponse> =
        ResponseEntity.ok(openAiService.generateRecipeChatReply(request))

    @PostMapping("/generate-recipe-image")
    fun generateImage(@RequestBody request: RecipeImageRequest): ResponseEntity<RecipeImageResponse> {
        val imageBase64 =
            openAiService.generateRecipeImage(
                recipeTitle = request.title,
                recipeDescription = request.description,
                ingredients = request.ingredients,
            )
        return ResponseEntity.ok(RecipeImageResponse(imageBase64))
    }
}
