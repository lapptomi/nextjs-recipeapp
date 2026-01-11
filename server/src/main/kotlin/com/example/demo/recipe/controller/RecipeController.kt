package com.example.demo.user.controller

import com.example.demo.ApiPath
import com.example.demo.domain.PageResult
import com.example.demo.recipe.domain.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.CreateRecipeRatingDTO
import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.recipe.domain.RecipeListItemDTO
import com.example.demo.recipe.service.RecipeService
import com.example.demo.user.domain.User
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping(ApiPath.RECIPES_API)
class RecipeController(private val recipeService: RecipeService) {

    @GetMapping
    fun getAll(
        @RequestParam(name = "title", defaultValue = "", required = false) recipeTitle: String,
        @RequestParam(name = "page", defaultValue = "1", required = false) page: Int,
        @RequestParam(name = "page_size", defaultValue = "12", required = false) pageSize: Int,
        @RequestParam(name = "sort_by", defaultValue = "date_desc", required = false) sortBy: String,
    ): ResponseEntity<PageResult<RecipeListItemDTO>> =
        ResponseEntity.ok(recipeService.getAll(recipeTitle, page, pageSize, sortBy))

    @GetMapping("/{id}")
    fun getRecipeById(@PathVariable id: Int): ResponseEntity<RecipeDTO> =
        ResponseEntity.ok(recipeService.findById(id))

    @PostMapping
    fun createRecipe(
        @AuthenticationPrincipal user: User,
        @RequestPart(value = "recipe") recipeJson: String,
        @RequestPart(value = "image", required = false) image: MultipartFile?,
    ): ResponseEntity<RecipeDTO> {
        val objectMapper = jacksonObjectMapper()
        val createRecipeDTO: CreateRecipeDTO = objectMapper.readValue(recipeJson)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(recipeService.createRecipe(user, createRecipeDTO, image))
    }

    @PostMapping("/{id}/comments")
    fun addComment(
        @AuthenticationPrincipal user: User,
        @PathVariable id: Int,
        @RequestBody commentDto: CreateRecipeCommentDTO,
    ): ResponseEntity<RecipeDTO> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(recipeService.addComment(user, id, commentDto))

    @PostMapping("/{id}/ratings")
    fun addRating(
        @AuthenticationPrincipal user: User,
        @PathVariable id: Int,
        @RequestBody rating: CreateRecipeRatingDTO,
    ): ResponseEntity<RecipeDTO> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(recipeService.createRecipeRating(user, id, rating))

    @PutMapping("/{id}/ratings")
    fun updateRating(
        @AuthenticationPrincipal user: User,
        @PathVariable id: Int,
        @RequestBody rating: CreateRecipeRatingDTO,
    ): ResponseEntity<RecipeDTO> = ResponseEntity.ok(recipeService.updateRating(user, id, rating))
}
