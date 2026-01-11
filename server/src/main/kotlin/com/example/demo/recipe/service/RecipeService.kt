package com.example.demo.recipe.service

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
import com.example.demo.user.domain.User
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class RecipeService(val s3Service: S3Service, val recipeRepository: RecipeRepository) {
    fun getAll(
        recipeTitle: String,
        page: Int,
        pageSize: Int,
        sortBy: String,
    ): PageResult<RecipeListItemDTO> {
        val recipes = recipeRepository.fetchRecipes(recipeTitle, page, pageSize, sortBy)
        return PageResult(
            content =
                recipes.map {
                    it.toRecipeListItemDTO(
                        presignedUrl =
                            it.image?.let { imageName -> s3Service.getPresignedUrl(imageName) },
                        ratings = recipeRepository.fetchRecipeRatings(it.id),
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

    fun createRecipe(
        user: User,
        createRecipeDTO: CreateRecipeDTO,
        image: MultipartFile?,
    ): RecipeDTO {
        val imageName = image?.let { s3Service.uploadFile(it) }
        val createdRecipe = recipeRepository.createRecipe(user.id, createRecipeDTO, imageName)

        return createdRecipe.toRecipeDTO(
            presignedUrl = imageName?.let { s3Service.getPresignedUrl(it) },
            comments = emptyList(),
            ratings = emptyList(),
        )
    }

    fun updateRating(user: User, recipeId: Int, ratingDto: CreateRecipeRatingDTO): RecipeDTO {
        val existingRating =
            recipeRepository.findRecipeRatingByRecipeIdAndAuthorId(recipeId, user.id)
                ?: throw RecipeNotFoundException(recipeId.toString())

        recipeRepository.updateRecipeRating(ratingId = existingRating.id, type = ratingDto.type)
        val recipeWithUpdatedRatings = findById(recipeId)
        return recipeWithUpdatedRatings
    }

    fun createRecipeRating(user: User, recipeId: Int, ratingDto: CreateRecipeRatingDTO): RecipeDTO {
        if (recipeRepository.existsByRecipeIdAndAuthorId(recipeId, user.id)) {
            throw IllegalArgumentException("User has already rated this recipe")
        }
        recipeRepository.createRecipeRating(recipeId, user.id, ratingDto.type)
        val recipeWithUpdatedRatings = findById(recipeId)
        return recipeWithUpdatedRatings
    }

    fun addComment(user: User, recipeId: Int, commentDto: CreateRecipeCommentDTO): RecipeDTO {
        recipeRepository.createRecipeComment(recipeId, user.id, commentDto.message)
        val recipeWithUpdatedComments = findById(recipeId)
        return recipeWithUpdatedComments
    }
}
