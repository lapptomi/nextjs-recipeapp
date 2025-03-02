package com.example.demo.user.service

import com.example.demo.recipe.domain.dto.CreateRecipeDTO
import com.example.demo.recipe.domain.recipecomment.dto.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.reciperating.dto.CreateRecipeRatingDTO
import com.example.demo.recipe.domain.reciperating.RecipeRating
import com.example.demo.recipe.mapper.RecipeMapper
import com.example.demo.recipe.repository.RecipeCommentRepository
import com.example.demo.recipe.repository.RecipeRatingRepository
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.RecipeDTO
import com.example.demo.user.domain.User
import com.example.demo.user.repository.RecipeRepository
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class RecipeService(
    private val recipeRepository: RecipeRepository,
    private val recipeCommentRepository: RecipeCommentRepository,
    private val recipeRatingRepository: RecipeRatingRepository,
    private val recipeMapper: RecipeMapper
) {
    fun getRecipes(recipeTitle: String, page: Int, pageSize: Int, sortBy: String): Page<RecipeDTO> {
        val sortDirection = if (sortBy == "date_asc") Sort.Direction.ASC else Sort.Direction.DESC
        val pageable = PageRequest.of(page - 1, pageSize, Sort.by(sortDirection, "createdAt"))
        return recipeRepository
            .findByTitleContainingIgnoreCase(recipeTitle, pageable)
            .map { RecipeMapper().toDTO(it) }
    }

    fun getRecipeById(id: Int): RecipeDTO = recipeMapper.toDTO(findRecipeById(id))

    fun createRecipe(user: User, recipeJson: String, image: MultipartFile?): RecipeDTO {
        val objectMapper = jacksonObjectMapper()
        val recipe: CreateRecipeDTO = objectMapper.readValue(recipeJson)
        val createdRecipe = recipeRepository.save(
            Recipe(
                author = user,
                title = recipe.title,
                description = recipe.description,
                ingredients = recipe.ingredients,
                cookingTime = recipe.cookingTime,
                servings = recipe.servings,
                instructions = recipe.instructions,
                image = null,
            )
        )
        return recipeMapper.toDTO(createdRecipe)
    }

    private fun createRating(user: User, recipe: Recipe, rating: CreateRecipeRatingDTO) {
        recipeRatingRepository.save(RecipeRating(author = user, recipe = recipe, type = rating.type))
    }

    private fun updateExistingRating(existingRating: RecipeRating, rating: CreateRecipeRatingDTO) {
        recipeRatingRepository.save(existingRating.copy(type = rating.type))
    }

    fun addRating(user: User, recipeId: Int, rating: CreateRecipeRatingDTO): RecipeDTO {
        val recipe = findRecipeById(recipeId)
        val existingRating = recipe.ratings.find { it.author.id == user.id }
        existingRating?.let { updateExistingRating(it, rating) } ?: createRating(user, recipe, rating)

        return recipeMapper.toDTO(recipe)
    }

    fun addComment(user: User, recipeId: Int, commentDto: CreateRecipeCommentDTO): RecipeDTO {
        val recipe = findRecipeById(recipeId)
        recipeCommentRepository.save(RecipeComment(author = user, message = commentDto.message, recipe = recipe))

        return recipeMapper.toDTO(recipe)
    }

    private fun findRecipeById(id: Int): Recipe = recipeRepository
        .findById(id)
        .orElseThrow { throw NoSuchElementException("Recipe with id $id not found") }

}