package com.example.demo.user.mapper

import com.example.demo.recipe.domain.RecipeListItemDTO
import com.example.demo.user.domain.User
import com.example.demo.user.domain.UserDTO

fun User.toUserDTO(recipes: List<RecipeListItemDTO>? = emptyList()): UserDTO =
    UserDTO(id = id, username = username, email = email, recipes = recipes)
