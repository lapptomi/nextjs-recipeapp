package com.example.demo

import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User

object TextFixtures {
    val users =
        listOf(
            User(email = "email1", username = "user1", password = "password1"),
            User(email = "email2", username = "user2", password = "password2"),
        )

    val recipes =
        listOf(
            Recipe(
                title = "recipe1",
                description = "description1",
                author = users[0],
                ingredients = listOf("ingredient1", "ingredient2"),
                cookingTime = 100,
                instructions = "instructions",
            ),
            Recipe(
                title = "recipe2",
                description = "description2",
                author = users[1],
                ingredients = listOf("ingredient2", "ingredient3"),
                cookingTime = 12,
                instructions = "instructions2",
            ),
        )
}
