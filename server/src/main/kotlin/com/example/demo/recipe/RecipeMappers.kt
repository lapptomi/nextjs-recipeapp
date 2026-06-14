package com.example.demo.recipe

import com.example.demo.recipe.domain.*

fun RecipeDetail.toRecipeResponse(presignedUrl: String? = null): GetRecipeResponse =
    GetRecipeResponse(
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

fun RecipeListItem.toRecipeListItemResponse(presignedUrl: String?): RecipeListItemResponse =
    RecipeListItemResponse(
        id = id,
        title = title,
        description = description,
        image = presignedUrl,
        cookingTime = cookingTime,
        servings = servings,
        author = RecipeAuthor(id = authorId, username = authorUsername),
        createdAt = createdAt,
        averageRating = averageRating,
        totalRatings = totalRatings,
        category = category,
    )
