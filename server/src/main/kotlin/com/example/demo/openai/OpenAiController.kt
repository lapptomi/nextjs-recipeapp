package com.example.demo.openai

import com.example.demo.ApiPath
import com.example.demo.openai.domain.RecipeChatRequestDTO
import com.example.demo.openai.domain.RecipeChatResponseDTO
import com.example.demo.openai.domain.RecipeImageRequestDTO
import com.example.demo.openai.domain.RecipeImageResponseDTO
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
    fun recipeChat(@Valid @RequestBody request: RecipeChatRequestDTO): ResponseEntity<RecipeChatResponseDTO> =
        ResponseEntity.ok(openAiService.generateRecipeChatReply(request))

    @PostMapping("/generate-recipe-image")
    fun generateImage(@RequestBody request: RecipeImageRequestDTO): ResponseEntity<RecipeImageResponseDTO> {
        val imageBase64 =
            openAiService.generateRecipeImage(
                recipeTitle = request.title,
                recipeDescription = request.description,
                ingredients = request.ingredients,
            )
        return ResponseEntity.ok(RecipeImageResponseDTO(imageBase64))
    }
}
