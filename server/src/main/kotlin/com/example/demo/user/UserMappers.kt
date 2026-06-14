package com.example.demo.user

import com.example.demo.recipe.domain.RecipeListItemResponse
import com.example.demo.user.domain.User
import com.example.demo.user.domain.UserResponse

fun User.toUserDTO(recipes: List<RecipeListItemResponse>? = emptyList()): UserResponse =
    UserResponse(
        id = id,
        username = username,
        email = email,
        recipes = recipes,
        createdAt = createdAt.toString(),
        image = image,
    )
