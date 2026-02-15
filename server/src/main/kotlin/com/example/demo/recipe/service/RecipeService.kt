package com.example.demo.recipe.service

import com.example.demo.auth.service.AuthService
import com.example.demo.config.RecipeNotFoundException
import com.example.demo.domain.PageResult
import com.example.demo.recipe.domain.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.CreateRecipeRatingDTO
import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.recipe.domain.RecipeListItemDTO
import com.example.demo.recipe.mapper.toRecipeDTO
import com.example.demo.recipe.mapper.toRecipeListItemDTO
import com.example.demo.recipe.repository.RecipeRepository
import com.example.demo.s3.S3Service
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class RecipeService(
    private val s3Service: S3Service,
    private val recipeRepository: RecipeRepository,
    private val authService: AuthService,
) {
    fun getAll(recipeTitle: String, page: Int, pageSize: Int, sortBy: String): PageResult<RecipeListItemDTO> {
        val recipes = recipeRepository.fetchRecipes(recipeTitle, page, pageSize, sortBy)
        return PageResult(
            content =
                recipes.map {
                    it.toRecipeListItemDTO(
                        totalRatings = recipeRepository.fetchTotalRatingsForRecipe(it.id),
                        averageRating = recipeRepository.fetchAverageRatingForRecipe(it.id),
                        presignedUrl = it.image?.let { imageName -> s3Service.getPresignedUrl(imageName) },
                    )
                },
            page = page,
            size = pageSize,
            numberOfElements = recipes.size,
            totalElements = recipeRepository.fetchTotalRecipesCount(recipeTitle),
        )
    }

    fun findById(id: Int): RecipeDTO {
        val recipe = recipeRepository.findById(id)
        val recipeComments = recipeRepository.fetchRecipeComments(recipe.id)
        val recipeRatings = recipeRepository.fetchRecipeRatings(recipe.id)
        val presignedUrl = recipe.image?.let { s3Service.getPresignedUrl(it) }
        return recipe.toRecipeDTO(presignedUrl, recipeComments, recipeRatings)
    }

    fun createRecipe(createRecipeDTO: CreateRecipeDTO, image: MultipartFile?): RecipeDTO {
        val userId = authService.getCurrentUser().sub
        val imageName = image?.let { s3Service.uploadFile(it) }
        val createdRecipe = recipeRepository.createRecipe(userId, createRecipeDTO, imageName)
        return createdRecipe.toRecipeDTO(presignedUrl = imageName?.let { s3Service.getPresignedUrl(it) })
    }

    fun updateRating(recipeId: Int, ratingDto: CreateRecipeRatingDTO): RecipeDTO {
        val userId = authService.getCurrentUser().sub

        val existingRating =
            recipeRepository.findRecipeRatingByRecipeIdAndAuthorId(recipeId, userId)
                ?: throw RecipeNotFoundException(recipeId.toString())

        recipeRepository.updateRecipeRating(ratingId = existingRating.id, type = ratingDto.type)
        val recipeWithUpdatedRatings = findById(recipeId)
        return recipeWithUpdatedRatings
    }

    fun createRecipeRating(recipeId: Int, ratingDto: CreateRecipeRatingDTO): RecipeDTO {
        val userId = authService.getCurrentUser().sub

        if (recipeRepository.existsByRecipeIdAndAuthorId(recipeId, userId)) {
            throw IllegalArgumentException("User has already rated this recipe")
        }
        recipeRepository.createRecipeRating(recipeId, userId, ratingDto.type)
        val recipeWithUpdatedRatings = findById(recipeId)
        return recipeWithUpdatedRatings
    }

    fun addComment(recipeId: Int, commentDto: CreateRecipeCommentDTO): RecipeDTO {
        val userId = authService.getCurrentUser().sub
        recipeRepository.createRecipeComment(recipeId, userId, commentDto.message)
        val recipeWithUpdatedComments = findById(recipeId)
        return recipeWithUpdatedComments
    }
}
