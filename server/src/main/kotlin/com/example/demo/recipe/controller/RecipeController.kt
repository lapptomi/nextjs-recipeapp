package com.example.demo.user.controller

import com.example.demo.ApiPath
import com.example.demo.recipe.domain.dto.CreateRecipeDTO
import com.example.demo.recipe.domain.recipecomment.dto.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.dto.CreateRecipeRatingDTO
import com.example.demo.recipe.service.RecipeService
import com.example.demo.user.domain.RecipeDTO
import com.example.demo.user.domain.User
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
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
    ): ResponseEntity<MutableIterable<RecipeDTO>> =
        ResponseEntity.ok(recipeService.getAll(recipeTitle, page, pageSize, sortBy))

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

    @GetMapping("/{id}")
    fun getRecipeById(@PathVariable id: Int): ResponseEntity<RecipeDTO> =
        ResponseEntity.ok(recipeService.findById(id))

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
        ResponseEntity.status(HttpStatus.CREATED).body(recipeService.addRating(user, id, rating))
}
