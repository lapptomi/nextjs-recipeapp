package com.example.demo.recipe.mapper

import com.example.demo.recipe.domain.dto.RecipeAuthorDTO
import com.example.demo.recipe.domain.recipecomment.dto.RecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.dto.RecipeRatingDTO
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.RecipeDTO
import org.springframework.stereotype.Component

@Component
class RecipeMapper {
    fun toDTO(recipe: Recipe): RecipeDTO {
        return RecipeDTO(
            id = recipe.id,
            title = recipe.title,
            description = recipe.description,
            image = recipe.image,
            ingredients = recipe.ingredients,
            cookingTime = recipe.cookingTime,
            servings = recipe.servings,
            instructions = recipe.instructions,
            author = RecipeAuthorDTO(
                id = recipe.author.id,
                username = recipe.author.username,
                email = recipe.author.email
            ),
            createdAt = recipe.createdAt,
            comments = recipe.comments.map {
                RecipeCommentDTO(
                    author = RecipeAuthorDTO(
                        id = it.author.id,
                        username = it.author.username,
                        email = it.author.email
                    ),
                    message = it.message,
                    createdAt = it.createdAt.toString()
                )
            },
            ratings = recipe.ratings.map {
                RecipeRatingDTO(
                    author = RecipeAuthorDTO(
                        id = it.author.id,
                        username = it.author.username,
                        email = it.author.email
                    ),
                    type = it.type
                )
            }
        )
    }
}