package com.example.demo

import com.example.demo.config.SecurityConfig
import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.reciperating.RecipeRating
import com.example.demo.recipe.domain.reciperating.RecipeRatingType
import com.example.demo.recipe.repository.RecipeCommentRepository
import com.example.demo.recipe.repository.RecipeRatingRepository
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import com.example.demo.user.repository.RecipeRepository
import com.example.demo.user.repository.UserRepository
import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile


@SpringBootApplication
@OpenAPIDefinition(
    info = Info(
        title = "My API",
        version = "v1",
        description = "REST API using Spring Boot and Kotlin"
    )
)
class DemoApplication {

    @Bean
    @Profile("dev") // Run initDatabase only when SPRING_PROFILES_ACTIVE=dev
    fun initDatabase(
        userRepository: UserRepository,
        recipeRepository: RecipeRepository,
        recipeRatingRepository: RecipeRatingRepository,
        recipeCommentRepository: RecipeCommentRepository,
        securityConfig: SecurityConfig
    ): CommandLineRunner {
        // Add some data to the in-memory database if it's empty
        return CommandLineRunner {
            fun encodePassword(password: String) = securityConfig.passwordEncoder().encode(password)

            fun generateRandomString(length: Int): String = (1..length).map { ('a'..'z').random() }.joinToString("")

            val users = (0..10)
                .map { User(username = "User $it", email = "user$it", password = encodePassword("user$it")) }
                .plus(User(username = "admin", email = "admin", password = encodePassword("admin")))

            val recipes = (0..20).map {
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

            val recipeComments = (0..10).map {
                RecipeComment(author = users[0], message = generateRandomString(500), recipe = recipes[0])
            }

            val recipeRatings = users.flatMap { user ->
                recipes.map { recipe ->
                    RecipeRating(author = user, type = RecipeRatingType.values().random(), recipe = recipe)
                }
            }

            if (userRepository.count() == 0L) userRepository.saveAll(users)
            if (recipeRepository.count() == 0L) recipeRepository.saveAll(recipes)
            if (recipeCommentRepository.count() == 0L) recipeCommentRepository.saveAll(recipeComments)
            if (recipeRatingRepository.count() == 0L) recipeRatingRepository.saveAll(recipeRatings)
        }
    }
}

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
