package com.example.demo.user.mapper

import com.example.demo.recipe.mapper.RecipeMapper
import com.example.demo.user.domain.User
import com.example.demo.user.domain.dto.UserDTO
import org.springframework.stereotype.Component

@Component
class UserMapper(private val recipeMapper: RecipeMapper) {
    fun toDTO(user: User): UserDTO {
        return UserDTO(
            id = user.id,
            email = user.email,
            username = user.username,
            recipes = user.recipes.map { recipeMapper.toDTO(it) },
        )
    }
}
