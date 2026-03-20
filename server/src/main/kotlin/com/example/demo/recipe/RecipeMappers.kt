package com.example.demo.recipe

import com.example.demo.recipe.domain.Recipe
import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.RecipeComment
import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.recipe.domain.RecipeListItemDTO
import com.example.demo.recipe.domain.RecipeRating

fun Recipe.toRecipeDTO(
    author: RecipeAuthorDTO,
    ingredients: List<String>,
    presignedUrl: String? = null,
    comments: List<RecipeComment> = emptyList(),
    ratings: List<RecipeRating> = emptyList(),
): RecipeDTO =
    RecipeDTO(
        id = id,
        title = title,
        description = description,
        image = presignedUrl,
        ingredients = ingredients,
        cookingTime = cookingTime,
        servings = servings,
        instructions = instructions,
        author = author,
        createdAt = createdAt,
        comments = comments,
        ratings = ratings,
        category = category,
    )

fun Recipe.toRecipeListItemDTO(
    author: RecipeAuthorDTO,
    presignedUrl: String?,
    averageRating: Double,
    totalRatings: Int,
): RecipeListItemDTO =
    RecipeListItemDTO(
        id = id,
        title = title,
        description = description,
        image = presignedUrl,
        cookingTime = cookingTime,
        servings = servings,
        author = author,
        createdAt = createdAt,
        averageRating = averageRating,
        totalRatings = totalRatings,
        category = category,
    )
