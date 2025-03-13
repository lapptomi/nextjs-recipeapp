package com.example.demo.recipe.service

import com.example.demo.TextFixtures
import com.example.demo.config.RecipeNotFoundException
import com.example.demo.recipe.domain.dto.CreateRecipeDTO
import com.example.demo.recipe.domain.recipecomment.dto.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.RecipeRatingType
import com.example.demo.recipe.domain.reciperating.dto.CreateRecipeRatingDTO
import com.example.demo.user.repository.RecipeRepository
import com.example.demo.user.repository.UserRepository
import com.example.demo.user.service.UserService
import kotlin.test.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class RecipeServiceIntegrationTest {

    @Autowired private lateinit var userService: UserService
    @Autowired private lateinit var reicpeRepository: RecipeRepository
    @Autowired private lateinit var recipeService: RecipeService
    @Autowired private lateinit var userRepository: UserRepository

    @BeforeEach
    fun setup() {
        userRepository.deleteAll()
        userRepository.saveAll(TextFixtures.users)
        reicpeRepository.saveAll(TextFixtures.recipes)
    }

    @Test
    fun `getAll returns the right amount of recipes`() {
        val result =
            recipeService.getAll(recipeTitle = "", page = 1, pageSize = 10, sortBy = "date_asc")
        assertEquals(TextFixtures.recipes.size, result.totalElements.toInt())
    }

    @Test
    fun `getAll returns the right amount of recipes when using the title param`() {
        val result =
            recipeService.getAll(recipeTitle = "", page = 1, pageSize = 10, sortBy = "date_asc")
        assertEquals(TextFixtures.recipes.size, result.totalElements.toInt())

        val result2 =
            recipeService.getAll(
                recipeTitle = TextFixtures.recipes[0].title,
                page = 1,
                pageSize = 1,
                sortBy = "date_asc",
            )
        assertEquals(1, result2.totalElements.toInt())
        assertEquals(TextFixtures.recipes[0].title, result2.content[0].title)

        val result3 =
            recipeService.getAll(
                recipeTitle = TextFixtures.recipes[1].title,
                page = 1,
                pageSize = 10,
                sortBy = "date_asc",
            )
        assertEquals(1, result3.totalElements.toInt())
        assertEquals(TextFixtures.recipes[1].title, result3.content[0].title)
    }

    @Test
    fun `getRecipeById throws RecipeNotFoundException when recipe does not exist`() {
        assertEquals(
            TextFixtures.recipes[0].id,
            recipeService.findById(TextFixtures.recipes[0].id).id,
        )

        val nonExistentId = -999
        val exception =
            assertThrows<RecipeNotFoundException> { recipeService.findById(nonExistentId) }

        assertEquals("Recipe with id $nonExistentId not found", exception.message)
    }

    @Test
    fun `createRecipe saves a new recipe`() {
        val author = TextFixtures.users[0]
        val createRecipeDTO =
            CreateRecipeDTO(
                title = TextFixtures.recipes[0].title,
                description = TextFixtures.recipes[0].description,
                ingredients = TextFixtures.recipes[0].ingredients,
                cookingTime = TextFixtures.recipes[0].cookingTime,
                instructions = TextFixtures.recipes[0].instructions,
                servings = TextFixtures.recipes[0].servings,
            )

        val createdRecipe = recipeService.createRecipe(author, createRecipeDTO, null)
        assertEquals(createRecipeDTO.title, createdRecipe.title)
        assertEquals(createRecipeDTO.description, createdRecipe.description)
        assertEquals(author.id, createdRecipe.author.id)
        assertEquals(createRecipeDTO.ingredients, createdRecipe.ingredients)
        assertEquals(createRecipeDTO.cookingTime, createdRecipe.cookingTime)
        assertEquals(createRecipeDTO.instructions, createdRecipe.instructions)
        assertEquals(createRecipeDTO.servings, createdRecipe.servings)
    }

    @Test
    fun `addRating creates new rating to the recipe`() {
        val user = TextFixtures.users[0]
        val recipe = TextFixtures.recipes[0]
        val rating = CreateRecipeRatingDTO(type = RecipeRatingType.DISLIKE)
        val updatedRecipe = recipeService.addRating(user, recipe.id, rating)
        assertEquals(rating.type, updatedRecipe.ratings[0].type)
    }

    @Test
    fun `addRating updates the rating of the user if it already exists`() {
        val dislikeRating = CreateRecipeRatingDTO(type = RecipeRatingType.DISLIKE)
        val updatedRecipe =
            recipeService.addRating(
                TextFixtures.users[0],
                TextFixtures.recipes[0].id,
                dislikeRating,
            )
        assertEquals(dislikeRating.type, updatedRecipe.ratings[0].type)

        val likeRating = CreateRecipeRatingDTO(type = RecipeRatingType.LIKE)
        val updatedRating =
            recipeService.addRating(TextFixtures.users[0], TextFixtures.recipes[0].id, likeRating)
        assertEquals(1, updatedRecipe.ratings.size)
        assertEquals(likeRating.type, updatedRating.ratings[0].type)
    }

    @Test
    fun `addComment creates a new comment`() {
        val user = TextFixtures.users[0]
        val recipe = TextFixtures.recipes[0]
        val comment = CreateRecipeCommentDTO(message = "comment")
        val updatedRecipe = recipeService.addComment(user, recipe.id, comment)

        assertEquals(1, updatedRecipe.comments.size)
        assertEquals(comment.message, updatedRecipe.comments[0].message)
    }
}
