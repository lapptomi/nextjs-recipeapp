package com.example.demo.recipe.service

import com.example.demo.PageResult
import com.example.demo.config.RecipeNotFoundException
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.recipe.domain.RecipeListItemDTO
import com.example.demo.recipe.domain.recipecomment.dto.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.dto.CreateRecipeRatingDTO
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
        val mappedRecipes =
            recipes.map {
                RecipeListItemDTO(
                    id = it.id,
                    title = it.title,
                    description = it.description,
                    ingredients = it.ingredients,
                    instructions = it.instructions,
                    image = it.image?.let { imageName -> s3Service.getPresignedUrl(imageName) },
                    cookingTime = it.cookingTime,
                    servings = it.servings,
                    author = it.author,
                    ratings = recipeRepository.fetchRecipeRatings(it.id),
                    createdAt = it.createdAt,
                )
            }

        return PageResult(
            content = mappedRecipes,
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

        return RecipeDTO(
            id = recipe.id,
            title = recipe.title,
            description = recipe.description,
            image = presignedUrl,
            ingredients = recipe.ingredients,
            cookingTime = recipe.cookingTime,
            servings = recipe.servings,
            instructions = recipe.instructions,
            author = recipe.author,
            createdAt = recipe.createdAt,
            comments = recipeComments,
            ratings = recipeRatings,
        )
    }

    fun createRecipe(
        user: User,
        createRecipeDTO: CreateRecipeDTO,
        image: MultipartFile?,
    ): RecipeDTO {
        val createdRecipe =
            recipeRepository.createRecipe(
                userId = user.id,
                createRecipeDTO = createRecipeDTO,
                imageName = image?.let { s3Service.uploadFile(image) },
            )

        return RecipeDTO(
            id = createdRecipe.id,
            title = createdRecipe.title,
            description = createdRecipe.description,
            image = createdRecipe.image?.let { s3Service.getPresignedUrl(it) },
            ingredients = createdRecipe.ingredients,
            cookingTime = createdRecipe.cookingTime,
            servings = createdRecipe.servings,
            instructions = createdRecipe.instructions,
            author = createdRecipe.author,
            createdAt = createdRecipe.createdAt,
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
