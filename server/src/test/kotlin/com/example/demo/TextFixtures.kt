package com.example.demo

import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.RecipeDTO
import com.example.demo.user.domain.UserDTO
import java.time.LocalDateTime

object TextFixtures {
    val users =
        listOf(
            UserDTO(id = 1, email = "email1", username = "user1", createdAt = "2024-01-01T00:00:00"),
            UserDTO(id = 2, email = "email2", username = "user2", createdAt = "2024-01-02T00:00:00"),
        )

    val recipes =
        listOf(
            RecipeDTO(
                id = 1,
                title = "recipe1",
                description = "description1",
                author = RecipeAuthorDTO(id = users[0].id, username = users[0].username),
                ingredients = listOf("ingredient1", "ingredient2"),
                cookingTime = 100,
                instructions = "instructions",
                image = null,
                servings = 2,
                createdAt = LocalDateTime.now(),
                category = "category1",
            ),
            RecipeDTO(
                id = 2,
                title = "recipe2",
                description = "description2",
                author = RecipeAuthorDTO(id = users[1].id, username = users[1].username),
                ingredients = listOf("ingredient2", "ingredient3"),
                cookingTime = 12,
                instructions = "instructions2",
                image = null,
                servings = 2,
                createdAt = LocalDateTime.now(),
                category = "category2",
            ),
        )
}
