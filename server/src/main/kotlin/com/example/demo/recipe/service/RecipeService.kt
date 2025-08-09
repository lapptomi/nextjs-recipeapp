package com.example.demo.recipe.service

import com.example.demo.config.RecipeNotFoundException
import com.example.demo.recipe.domain.dto.CreateRecipeDTO
import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.recipecomment.dto.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.RecipeRating
import com.example.demo.recipe.domain.reciperating.dto.CreateRecipeRatingDTO
import com.example.demo.recipe.mapper.RecipeMapper
import com.example.demo.recipe.repository.RecipeCommentRepository
import com.example.demo.recipe.repository.RecipeRatingRepository
import com.example.demo.s3.S3Service
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.RecipeDTO
import com.example.demo.user.domain.User
import com.example.demo.user.repository.RecipeRepository
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
    private val recipeMapper: RecipeMapper,
    private val s3Service: S3Service,
) {
    fun getAll(recipeTitle: String, page: Int, pageSize: Int, sortBy: String): Page<RecipeDTO> {
        val sortDirection = if (sortBy == "date_asc") Sort.Direction.ASC else Sort.Direction.DESC
        val pageable = PageRequest.of(page - 1, pageSize, Sort.by(sortDirection, "createdAt"))
        return recipeRepository.findByTitleContainingIgnoreCase(recipeTitle, pageable).map {
            recipeMapper.toDTO(it)
        }
    }

    fun findById(id: Int): RecipeDTO = recipeMapper.toDTO(findRecipeById(id))

    fun createRecipe(
        user: User,
        createRecipeDTO: CreateRecipeDTO,
        image: MultipartFile?,
    ): RecipeDTO {
        val uploadedImageName = image?.let { s3Service.uploadFile(image) }
        val recipe = recipeMapper.toEntity(uploadedImageName, createRecipeDTO, user)
        return recipeMapper.toDTO(recipeRepository.save(recipe))
    }

    fun addRating(user: User, recipeId: Int, rating: CreateRecipeRatingDTO): RecipeDTO {
        val recipe = findRecipeById(recipeId)
        val userHasRated = recipe.ratings.any { it.author.id == user.id }
        require(!userHasRated) { "User has already rated this recipe" }

        val rating = RecipeRating(author = user, recipe = recipe, type = rating.type)
        recipeRatingRepository.save(rating)

        return recipeMapper.toDTO(findRecipeById(recipeId))
    }

    fun updateRating(user: User, recipeId: Int, rating: CreateRecipeRatingDTO): RecipeDTO {
        val existingRating =
            recipeRatingRepository.findByRecipeIdAndAuthorId(recipeId, user.id)
                ?: throw RecipeNotFoundException(recipeId.toString())

        recipeRatingRepository.save(existingRating.copy(type = rating.type))
        return recipeMapper.toDTO(findRecipeById(recipeId))
    }

    fun addComment(user: User, recipeId: Int, commentDto: CreateRecipeCommentDTO): RecipeDTO {
        val recipe = findRecipeById(recipeId)
        val comment = RecipeComment(author = user, message = commentDto.message, recipe = recipe)
        recipeCommentRepository.save(comment)

        return recipeMapper.toDTO(findRecipeById(recipeId))
    }

    private fun findRecipeById(id: Int): Recipe =
        recipeRepository.findById(id).orElseThrow { RecipeNotFoundException(id.toString()) }
}
