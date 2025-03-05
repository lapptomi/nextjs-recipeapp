package com.example.demo.config

import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.reciperating.RecipeRating
import com.example.demo.recipe.domain.reciperating.RecipeRatingType
import com.example.demo.recipe.repository.RecipeCommentRepository
import com.example.demo.recipe.repository.RecipeRatingRepository
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import com.example.demo.user.repository.RecipeRepository
import com.example.demo.user.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@Configuration
class DatabaseInitializer(
    private val securityConfig: SecurityConfig,
    private val userRepository: UserRepository,
    private val recipeRepository: RecipeRepository,
    private val recipeRatingRepository: RecipeRatingRepository,
    private val recipeCommentRepository: RecipeCommentRepository,
) {
    @Profile("dev")
    @Bean
    fun addInitialData(): CommandLineRunner {
        return CommandLineRunner {
            val users = createUsers()
            val recipes = createRecipes(users)
            val recipeComments = createRecipeComments(users, recipes)
            val recipeRatings = createRecipeRatings(users, recipes)

            if (userRepository.count() == 0L) userRepository.saveAll(users)
            if (recipeRepository.count() == 0L) recipeRepository.saveAll(recipes)
            if (recipeCommentRepository.count() == 0L)
                recipeCommentRepository.saveAll(recipeComments)
            if (recipeRatingRepository.count() == 0L) recipeRatingRepository.saveAll(recipeRatings)
        }
    }

    private fun createUsers(): List<User> {
        fun encodePassword(password: String) = securityConfig.passwordEncoder().encode(password)
        return (0..10)
            .map {
                User(username = "User $it", email = "user$it", password = encodePassword("user$it"))
            }
            .plus(User(username = "admin", email = "admin", password = encodePassword("admin")))
    }

    private fun createRecipes(users: List<User>): List<Recipe> {
        fun generateRandomString(length: Int): String =
            (1..length).map { ('a'..'z').random() }.joinToString("")
        return (0..20).map {
            Recipe(
                author = users[0],
                title = "Recipe $it",
                description = generateRandomString(500),
                ingredients = (0..5).map { "Ingredient $it" },
                cookingTime = 10,
                servings = 2,
                instructions = generateRandomString(5000),
                image = null,
            )
        }
    }

    private fun createRecipeComments(
        users: List<User>,
        recipes: List<Recipe>,
    ): List<RecipeComment> {
        fun generateRandomString(length: Int): String =
            (1..length).map { ('a'..'z').random() }.joinToString("")
        return (0..10).map {
            RecipeComment(
                author = users[0],
                message = generateRandomString(500),
                recipe = recipes[0],
            )
        }
    }

    private fun createRecipeRatings(users: List<User>, recipes: List<Recipe>): List<RecipeRating> {
        return users.flatMap { user ->
            recipes.map { recipe ->
                RecipeRating(
                    author = user,
                    type = RecipeRatingType.values().random(),
                    recipe = recipe,
                )
            }
        }
    }
}
