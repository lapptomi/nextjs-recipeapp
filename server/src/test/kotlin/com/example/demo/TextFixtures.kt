package com.example.demo

import com.example.demo.recipe.domain.GetRecipeResponse
import com.example.demo.recipe.domain.RecipeAuthor
import com.example.demo.user.domain.UserResponse
import java.time.LocalDateTime

object TextFixtures {
    val users =
        listOf(
            UserResponse(id = 1, email = "email1", username = "user1", createdAt = "2024-01-01T00:00:00"),
            UserResponse(id = 2, email = "email2", username = "user2", createdAt = "2024-01-02T00:00:00"),
        )

    val recipes =
        listOf(
            GetRecipeResponse(
                id = 1,
                title = "recipe1",
                description = "description1",
                author = RecipeAuthor(id = users[0].id, username = users[0].username),
                ingredients = listOf("ingredient1", "ingredient2"),
                cookingTime = 100,
                instructions = "instructions",
                image = null,
                servings = 2,
                createdAt = LocalDateTime.now(),
                category = "category1",
            ),
            GetRecipeResponse(
                id = 2,
                title = "recipe2",
                description = "description2",
                author = RecipeAuthor(id = users[1].id, username = users[1].username),
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
