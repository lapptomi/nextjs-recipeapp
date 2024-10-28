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

			val users = listOf(
				User(username = "user", email = "email", password = encodePassword("password")),
				User(username = "admin", email = "admin", password = encodePassword("admin")),
				User(username = "test", email = "test", password = encodePassword("test"))
			)

			val recipes = (0..20).map {
				Recipe(
					author = users[0],
					title = "Recipe $it",
					description = "Description $it",
					ingredients = listOf("Ingredient 1", "Ingredient 2"),
					cookingTime = 10,
					servings = 2,
					instructions = "Instructions $it",
					image = null,
				)
			}
			val recipeComments = (0..10).map {
				RecipeComment(author = users[0], message = "Comment $it", recipe = recipes[0])
			}
			val recipeRatings = (0..10).map {
				RecipeRating(author = users[0], type = RecipeRatingType.LIKE, recipe = recipes[0])
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
