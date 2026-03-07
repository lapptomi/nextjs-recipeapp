package com.example.demo.recipe.controller

import com.example.demo.ApiPath
import com.example.demo.domain.PageResult
import com.example.demo.recipe.domain.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.CreateRecipeRatingDTO
import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.recipe.domain.RecipeListItemDTO
import com.example.demo.recipe.service.RecipeService
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping(ApiPath.RECIPES_API)
class RecipeController(private val recipeService: RecipeService) {

    @GetMapping
    fun getAll(
        @RequestParam(name = "title", defaultValue = "", required = false) recipeTitle: String,
        @RequestParam(name = "category", required = false) category: String?,
        @RequestParam(name = "page", defaultValue = "1", required = false) page: Int,
        @RequestParam(name = "page_size", required = false) pageSize: Int?,
        @RequestParam(name = "pageSize", required = false) pageSizeAlias: Int?,
        @RequestParam(name = "sort_by", required = false) sortBy: String?,
        @RequestParam(name = "sort", required = false) sortByAlias: String?,
    ): ResponseEntity<PageResult<RecipeListItemDTO>> {
        val resolvedPageSize = pageSize ?: pageSizeAlias ?: 12
        val resolvedSortBy = sortBy ?: sortByAlias ?: "date_desc"
        val normalizedCategory = category?.trim()?.lowercase()?.takeIf { it.isNotEmpty() && it != "all" }

        return ResponseEntity.ok(
            recipeService.getAll(
                recipeTitle = recipeTitle,
                category = normalizedCategory,
                page = page,
                pageSize = resolvedPageSize,
                sortBy = resolvedSortBy,
            )
        )
    }

    @GetMapping("/{id}")
    fun getRecipeById(@PathVariable id: Int): ResponseEntity<RecipeDTO> = ResponseEntity.ok(recipeService.findById(id))

    @PostMapping
    fun createRecipe(@RequestBody createRecipeDTO: CreateRecipeDTO): ResponseEntity<RecipeDTO> =
        ResponseEntity.status(HttpStatus.CREATED).body(recipeService.createRecipe(createRecipeDTO))

    @PostMapping("/{id}/comments")
    fun addComment(@PathVariable id: Int, @RequestBody commentDto: CreateRecipeCommentDTO): ResponseEntity<RecipeDTO> =
        ResponseEntity.status(HttpStatus.CREATED).body(recipeService.addComment(id, commentDto))

    @PostMapping("/{id}/ratings")
    fun addRating(@PathVariable id: Int, @RequestBody rating: CreateRecipeRatingDTO): ResponseEntity<RecipeDTO> =
        ResponseEntity.status(HttpStatus.CREATED).body(recipeService.createRecipeRating(id, rating))

    @PostMapping("/{id}/image", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadImage(@PathVariable id: Int, @RequestPart("image") image: MultipartFile): ResponseEntity<RecipeDTO> =
        ResponseEntity.ok(recipeService.uploadRecipeImage(id, image))

    @PostMapping("/{id}/image/generate")
    fun generateImage(@PathVariable id: Int): ResponseEntity<RecipeDTO> =
        ResponseEntity.ok(recipeService.generateRecipeImage(id))

    @PutMapping("/{id}/ratings")
    fun updateRating(@PathVariable id: Int, @RequestBody rating: CreateRecipeRatingDTO): ResponseEntity<RecipeDTO> =
        ResponseEntity.ok(recipeService.updateRating(id, rating))
}
