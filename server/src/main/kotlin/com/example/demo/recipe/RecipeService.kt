package com.example.demo.recipe

import com.example.demo.auth.AuthService
import com.example.demo.config.RecipeNotFoundException
import com.example.demo.domain.PageResult
import com.example.demo.recipe.domain.CreateRecipeCommentRequest
import com.example.demo.recipe.domain.CreateRecipeRatingRequest
import com.example.demo.recipe.domain.CreateRecipeRequest
import com.example.demo.recipe.domain.GetRecipeResponse
import com.example.demo.recipe.domain.RecipeDetail
import com.example.demo.recipe.domain.RecipeListItemResponse
import com.example.demo.s3.S3Service
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class RecipeService(
    private val s3Service: S3Service,
    private val recipeRepository: RecipeRepository,
    private val authService: AuthService,
) {
    fun getAll(
        recipeTitle: String,
        category: String?,
        page: Int,
        pageSize: Int,
        sortBy: String,
    ): PageResult<RecipeListItemResponse> {
        val recipePage = recipeRepository.fetchRecipesByPage(recipeTitle, category, page, pageSize, sortBy)

        return PageResult(
            content =
                recipePage.items.map {
                    it.toRecipeListItemResponse(
                        presignedUrl = it.image?.let { imageName -> s3Service.getPresignedUrl(imageName) }
                    )
                },
            page = page,
            size = pageSize,
            numberOfElements = recipePage.items.size,
            totalElements = recipePage.totalCount,
        )
    }

    fun findById(id: Int): GetRecipeResponse {
        val recipe = recipeRepository.findRecipeWithDetailsById(id)
        val presignedUrl = recipe.image?.let { s3Service.getPresignedUrl(it) }
        return recipe.toRecipeResponse(presignedUrl)
    }

    fun createRecipe(createRecipeDTO: CreateRecipeRequest): GetRecipeResponse {
        val userId = authService.getCurrentUser().sub
        val created = recipeRepository.createRecipe(userId, createRecipeDTO)
        val recipe = recipeRepository.findRecipeWithDetailsById(created.id)
        return recipe.toRecipeResponse()
    }

    fun uploadRecipeImage(recipeId: Int, image: MultipartFile): GetRecipeResponse {
        val recipe = recipeRepository.findRecipeWithDetailsById(recipeId)
        requireCurrentUserToBeAuthor(recipe)

        val imageName =
            s3Service.uploadBytes(
                image.bytes,
                image.originalFilename?.substringAfterLast('.', "") ?: "",
                image.contentType ?: "application/octet-stream",
            )
        recipeRepository.updateRecipeImage(recipeId, imageName)

        return findById(recipeId)
    }

    fun updateRating(recipeId: Int, ratingDto: CreateRecipeRatingRequest): GetRecipeResponse {
        val userId = authService.getCurrentUser().sub

        val existingRating =
            recipeRepository.findRecipeRatingByRecipeIdAndAuthorId(recipeId, userId)
                ?: throw RecipeNotFoundException(recipeId.toString())

        recipeRepository.updateRecipeRating(ratingId = existingRating.id, type = ratingDto.type)
        return findById(recipeId)
    }

    fun createRecipeRating(recipeId: Int, ratingDto: CreateRecipeRatingRequest): GetRecipeResponse {
        val userId = authService.getCurrentUser().sub

        if (recipeRepository.existsByRecipeIdAndAuthorId(recipeId, userId)) {
            throw IllegalArgumentException("User has already rated this recipe")
        }
        recipeRepository.createRecipeRating(recipeId, userId, ratingDto.type)
        return findById(recipeId)
    }

    fun addComment(recipeId: Int, commentDto: CreateRecipeCommentRequest): GetRecipeResponse {
        val userId = authService.getCurrentUser().sub
        recipeRepository.createRecipeComment(recipeId, userId, commentDto.message)
        return findById(recipeId)
    }

    private fun requireCurrentUserToBeAuthor(recipe: RecipeDetail) {
        val currentUserId = authService.getCurrentUser().sub

        if (recipe.userId != currentUserId) {
            throw IllegalArgumentException("Only the recipe author can modify the recipe.")
        }
    }
}
