package com.example.demo.recipe.mapper

import com.example.demo.recipe.domain.Recipe
import com.example.demo.recipe.domain.RecipeComment
import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.recipe.domain.RecipeListItemDTO
import com.example.demo.recipe.domain.RecipeRating

fun Recipe.toRecipeDTO(
    presignedUrl: String?,
    comments: List<RecipeComment>,
    ratings: List<RecipeRating>,
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
    )

fun Recipe.toRecipeListItemDTO(
    presignedUrl: String?,
    ratings: List<RecipeRating>,
): RecipeListItemDTO =
    RecipeListItemDTO(
        id = id,
        title = title,
        description = description,
        ingredients = ingredients,
        instructions = instructions,
        image = presignedUrl,
        cookingTime = cookingTime,
        servings = servings,
        author = author,
        ratings = ratings,
        createdAt = createdAt,
    )
