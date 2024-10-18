package com.example.demo.user.controller

import com.example.demo.ApiPath
import com.example.demo.recipe.domain.recipecomment.RecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.RecipeRatingDTO
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import com.example.demo.user.service.RecipeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping(ApiPath.ROOT + "/recipes")
class RecipeController(private val recipeService: RecipeService) {

    @GetMapping
    fun getAll(
        @RequestParam(name="title", defaultValue = "", required = false) recipeTitle: String,
        @RequestParam(name="page", defaultValue = "1", required = false) page: Int,
        @RequestParam(name="page_size", defaultValue = "12", required = false) pageSize: Int,
        @RequestParam(name="sort_by", defaultValue = "date_desc", required = false) sortBy: String
    ): ResponseEntity<MutableIterable<Recipe>> = ResponseEntity
        .ok(recipeService.getRecipes(recipeTitle, page, pageSize, sortBy))

    @PostMapping
    fun createRecipe(
        @AuthenticationPrincipal user: User,
        @RequestPart(value = "recipe") recipeJson: String,
        @RequestPart(value = "image", required = false) image: MultipartFile?
    ): ResponseEntity<Recipe> = ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.createRecipe(user, recipeJson, image))

    @GetMapping("/{id}")
    fun getRecipeById(@PathVariable id: Int): ResponseEntity<Recipe> = ResponseEntity
        .ok(recipeService.getRecipeById(id))

    @PostMapping("/{id}/comments")
    fun addComment(
        @AuthenticationPrincipal user: User,
        @PathVariable id: Int,
        @RequestBody commentDto: RecipeCommentDTO
    ): ResponseEntity<Recipe> = ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.addComment(user, id, commentDto))

    @PostMapping("/{id}/ratings")
    fun addRating(
        @AuthenticationPrincipal user: User,
        @PathVariable id: Int,
        @RequestBody rating: RecipeRatingDTO
    ): ResponseEntity<Recipe> = ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.addRating(user, id, rating))
}