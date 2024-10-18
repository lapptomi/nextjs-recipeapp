package com.example.demo.user.service

import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.recipecomment.RecipeCommentDTO
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
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class RecipeService(
    private val recipeRepository: RecipeRepository,
    private val recipeCommentRepository: RecipeCommentRepository,
    private val recipeRatingRepository: RecipeRatingRepository
) {
    fun getBySearchParams(recipeTitle: String, page: Int, pageSize: Int): Page<Recipe> {
        val pageable = PageRequest.of(page - 1, pageSize)
        val recipes = recipeRepository.findByTitleContainingIgnoreCase(recipeTitle, pageable)
        return recipes
    }

    fun getRecipeById(id: Int): Recipe = recipeRepository.findById(id).get()

    fun createRecipe(user: User, recipeJson: String, image: MultipartFile?): Recipe {
        val objectMapper = jacksonObjectMapper()
        val recipe: RecipeDTO = objectMapper.readValue(recipeJson)
        val savedRecipe = recipeRepository.save(
            Recipe(
                author = user,
                title = recipe.title,
                description = recipe.description,
                ingredients = recipe.ingredients,
                cookingTime = recipe.cookingTime,
                servings = recipe.servings,
                instructions = recipe.instructions,
                image = "image link in the future"
            )
        )
        return savedRecipe
    }

    fun addRating(user: User, recipeId: Int, rating: RecipeRatingDTO): Recipe {
        val recipe = getRecipeById(recipeId)
        val existingRating = recipe.ratings.find { it.author.id == user.id }

        val recipeRating = existingRating?.apply {
            this.type = rating.type
        } ?: RecipeRating(author = user, recipe = recipe, type = rating.type).also {
            recipe.ratings = recipe.ratings + it
        }

        recipeRatingRepository.save(recipeRating)
        return recipe
    }

    fun addComment(user: User, recipeId: Int, commentDto: RecipeCommentDTO): Recipe {
        val recipe = getRecipeById(recipeId)
        val comment = RecipeComment(author = user, message = commentDto.message, recipe = recipe)
        recipeCommentRepository.save(comment)

        return recipe
    }
}