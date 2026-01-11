package com.example.demo.user.mapper

import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.user.domain.User
import com.example.demo.user.domain.UserDTO

fun User.toUserDTO(recipes: List<RecipeDTO>? = null): UserDTO =
    UserDTO(id = id, username = username, email = email, recipes = recipes)
