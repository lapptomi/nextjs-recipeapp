package com.example.demo.user.service

import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.recipecomment.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.recipecomment.RecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.CreateRecipeRatingDTO
import com.example.demo.recipe.domain.reciperating.RecipeRating
import com.example.demo.recipe.domain.reciperating.RecipeRatingDTO
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
    private val recipeRatingRepository: RecipeRatingRepository
) {
    fun getRecipes(recipeTitle: String, page: Int, pageSize: Int, sortBy: String): Page<RecipeDTO> {
        val sortDirection = if (sortBy == "date_asc") Sort.Direction.ASC else Sort.Direction.DESC
        val pageable = PageRequest.of(page - 1, pageSize, Sort.by(sortDirection, "createdAt"))
        return recipeRepository
            .findByTitleContainingIgnoreCase(recipeTitle, pageable)
            .map { recipeToRecipeDTO(it) }
    }

    fun getRecipeById(id: Int): RecipeDTO {
        val recipe = recipeRepository.findById(id).orElseThrow { throw NoSuchElementException("Recipe with id $id not found") }
        return recipeToRecipeDTO(recipe)
    }

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
        return recipeToRecipeDTO(createdRecipe)
    }

    fun addRating(user: User, recipeId: Int, rating: CreateRecipeRatingDTO): RecipeDTO {
        val recipe = recipeRepository.findById(recipeId).orElseThrow {
            throw NoSuchElementException("Recipe with id $recipeId not found")
        }

        var existingRating = recipe.ratings.find { it.author.id == user.id }
        val recipeRating = if (existingRating != null) {
            existingRating.apply { this.type = rating.type }
        } else {
            RecipeRating(author = user, recipe = recipe, type = rating.type).also {
                recipe.ratings = recipe.ratings + it
            }
        }

        recipeRatingRepository.save(recipeRating)
        return recipeToRecipeDTO(recipe)
    }

    fun addComment(user: User, recipeId: Int, commentDto: CreateRecipeCommentDTO): RecipeDTO {
        val recipe = recipeRepository.findById(recipeId).orElseThrow { throw NoSuchElementException("Recipe with id $recipeId not found") }
        val comment = RecipeComment(author = user, message = commentDto.message, recipe = recipe)

        recipeCommentRepository.save(comment)
        return recipeToRecipeDTO(recipe)
    }

    private fun recipeToRecipeDTO(recipe: Recipe): RecipeDTO {
        return RecipeDTO(
            id = recipe.id,
            title = recipe.title,
            description = recipe.description,
            image = recipe.image,
            ingredients = recipe.ingredients,
            cookingTime = recipe.cookingTime,
            servings = recipe.servings,
            instructions = recipe.instructions,
            author = RecipeAuthorDTO(id = recipe.author.id, username = recipe.author.username, email = recipe.author.email),
            createdAt = recipe.createdAt,
            comments = recipe.comments.map {
                RecipeCommentDTO(
                    author = RecipeAuthorDTO(id = it.author.id, username = it.author.username, email = it.author.email),
                    message = it.message,
                    createdAt = it.createdAt.toString(),
                )
            },
            ratings = recipe.ratings.map {
                RecipeRatingDTO(
                    author = RecipeAuthorDTO(id = it.author.id, username = it.author.username, email = it.author.email),
                    type = it.type,
                )
            }
        )
    }
}