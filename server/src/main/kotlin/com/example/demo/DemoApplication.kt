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
	@Profile("dev") // Run this function only when SPRING_PROFILES_ACTIVE=dev
	fun initDatabase(
		userRepository: UserRepository,
		recipeRepository: RecipeRepository,
		recipeRatingRepository: RecipeRatingRepository,
		recipeCommentRepository: RecipeCommentRepository,
		securityConfig: SecurityConfig
	): CommandLineRunner {
		return CommandLineRunner {
			// Add some data to the database if it's empty
			fun encodePassword(password: String) = securityConfig.passwordEncoder().encode(password)

			val users = listOf(
				User(username = "user", email = "email", password = encodePassword("password")),
				User(username = "admin", email = "admin", password = encodePassword("admin")),
				User(username = "test", email = "test", password = encodePassword("test"))
			)
			val recipes = listOf(
				Recipe(
					author = users[0],
					title = "Recipe 1",
					description = "Description 1",
					ingredients = listOf("Ingredient 1", "Ingredient 2"),
					cookingTime = 10,
					servings = 2,
					instructions = "Instructions 1"
				),
				Recipe(
					author = users[1],
					title = "Recipe 1",
					description = "Description 1",
					ingredients = listOf("Ingredient 1", "Ingredient 2"),
					cookingTime = 10,
					servings = 2,
					instructions = "Instructions 2"
				),
			)
			val recipeComments = listOf(
				RecipeComment(
					author = users[0],
					message = "Comment 1",
					recipe = recipes[0]
				),
				RecipeComment(
					author = users[1],
					message = "Comment 2",
					recipe = recipes[1]
				),
			)
			val recipeRatings = listOf(
				RecipeRating(
					author = users[0],
					type = RecipeRatingType.LIKE,
					recipe = recipes[0]
				),
				RecipeRating(
					author = users[1],
					type = RecipeRatingType.DISLIKE,
					recipe = recipes[1]
				),
			)

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
