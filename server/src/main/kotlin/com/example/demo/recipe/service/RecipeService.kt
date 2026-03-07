package com.example.demo.recipe.service

import com.example.demo.auth.service.AuthService
import com.example.demo.config.RecipeNotFoundException
import com.example.demo.domain.PageResult
import com.example.demo.openai.service.OpenAiImageService
import com.example.demo.recipe.domain.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.CreateRecipeRatingDTO
import com.example.demo.recipe.domain.Recipe
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
    private val openAiImageService: OpenAiImageService,
) {
    fun getAll(
        recipeTitle: String,
        category: String?,
        page: Int,
        pageSize: Int,
        sortBy: String,
    ): PageResult<RecipeListItemDTO> {
        val recipes = recipeRepository.fetchRecipes(recipeTitle, category, page, pageSize, sortBy)
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
            totalElements = recipeRepository.fetchTotalRecipesCount(recipeTitle, category),
        )
    }

    fun findById(id: Int): RecipeDTO {
        val recipe = requireRecipe(id)
        val recipeComments = recipeRepository.fetchRecipeComments(recipe.id)
        val recipeRatings = recipeRepository.fetchRecipeRatings(recipe.id)
        val presignedUrl = recipe.image?.let { s3Service.getPresignedUrl(it) }
        return recipe.toRecipeDTO(presignedUrl, recipeComments, recipeRatings)
    }

    fun createRecipe(createRecipeDTO: CreateRecipeDTO): RecipeDTO {
        val userId = authService.getCurrentUser().sub
        return recipeRepository.createRecipe(userId, createRecipeDTO).toRecipeDTO()
    }

    fun uploadRecipeImage(recipeId: Int, image: MultipartFile): RecipeDTO {
        val recipe = requireRecipe(recipeId)
        requireCurrentUserToBeAuthor(recipe)

        val imageName = s3Service.uploadFile(image)
        recipeRepository.updateRecipeImage(recipeId, imageName)

        return findById(recipeId)
    }

    fun generateRecipeImage(recipeId: Int): RecipeDTO {
        val recipe = requireRecipe(recipeId)
        requireCurrentUserToBeAuthor(recipe)

        val imageName = openAiImageService.generateRecipeImage(recipe)
        recipeRepository.updateRecipeImage(recipeId, imageName)

        return findById(recipeId)
    }

    fun updateRating(recipeId: Int, ratingDto: CreateRecipeRatingDTO): RecipeDTO {
        val userId = authService.getCurrentUser().sub

        val existingRating =
            recipeRepository.findRecipeRatingByRecipeIdAndAuthorId(recipeId, userId)
                ?: throw RecipeNotFoundException(recipeId.toString())

        recipeRepository.updateRecipeRating(ratingId = existingRating.id, type = ratingDto.type)
        return findById(recipeId)
    }

    fun createRecipeRating(recipeId: Int, ratingDto: CreateRecipeRatingDTO): RecipeDTO {
        val userId = authService.getCurrentUser().sub

        if (recipeRepository.existsByRecipeIdAndAuthorId(recipeId, userId)) {
            throw IllegalArgumentException("User has already rated this recipe")
        }
        recipeRepository.createRecipeRating(recipeId, userId, ratingDto.type)
        return findById(recipeId)
    }

    fun addComment(recipeId: Int, commentDto: CreateRecipeCommentDTO): RecipeDTO {
        val userId = authService.getCurrentUser().sub
        recipeRepository.createRecipeComment(recipeId, userId, commentDto.message)
        return findById(recipeId)
    }

    private fun requireRecipe(recipeId: Int) =
        recipeRepository.findByIdOrNull(recipeId) ?: throw RecipeNotFoundException(recipeId.toString())

    private fun requireCurrentUserToBeAuthor(recipe: Recipe) {
        val currentUserId = authService.getCurrentUser().sub

        if (recipe.author.id != currentUserId) {
            throw IllegalArgumentException("Only the recipe author can modify the recipe image.")
        }
    }
}
