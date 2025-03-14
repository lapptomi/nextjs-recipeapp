package com.example.demo.recipe.service

import com.example.demo.TextFixtures.recipes
import com.example.demo.TextFixtures.users
import com.example.demo.config.RecipeNotFoundException
import com.example.demo.recipe.domain.dto.CreateRecipeDTO
import com.example.demo.recipe.domain.recipecomment.dto.CreateRecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.RecipeRatingType
import com.example.demo.recipe.domain.reciperating.dto.CreateRecipeRatingDTO
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import com.example.demo.user.repository.RecipeRepository
import com.example.demo.user.repository.UserRepository
import kotlin.test.assertEquals
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class RecipeServiceIntegrationTest {

    @Autowired private lateinit var reicpeRepository: RecipeRepository
    @Autowired private lateinit var recipeService: RecipeService
    @Autowired private lateinit var userRepository: UserRepository

    private lateinit var testUser: User
    private lateinit var testRecipe: Recipe
    private lateinit var testRecipe2: Recipe

    @BeforeEach
    fun setup() {
        val user = userRepository.save<User>(users[0])
        val recipe = reicpeRepository.save<Recipe>(recipes[0].copy(author = user))
        val recipe2 = reicpeRepository.save<Recipe>(recipes[1].copy(author = user))
        testUser = user
        testRecipe = recipe
        testRecipe2 = recipe2
    }

    @AfterEach
    fun teardown() {
        userRepository.deleteAll()
        reicpeRepository.deleteAll()
    }

    @Test
    fun `getAll returns the right amount of recipes`() {
        val result =
            recipeService.getAll(recipeTitle = "", page = 1, pageSize = 10, sortBy = "date_asc")
        assertEquals(recipes.size, result.totalElements.toInt())
    }

    @Test
    fun `getAll returns the right amount of recipes when using the title param`() {
        val result =
            recipeService.getAll(recipeTitle = "", page = 1, pageSize = 10, sortBy = "date_asc")
        assertEquals(recipes.size, result.totalElements.toInt())

        val result2 =
            recipeService.getAll(
                recipeTitle = testRecipe.title,
                page = 1,
                pageSize = 1,
                sortBy = "date_asc",
            )
        assertEquals(1, result2.totalElements.toInt())
        assertEquals(testRecipe.title, result2.content[0].title)

        val result3 =
            recipeService.getAll(
                recipeTitle = testRecipe2.title,
                page = 1,
                pageSize = 10,
                sortBy = "date_asc",
            )
        assertEquals(1, result3.totalElements.toInt())
        assertEquals(testRecipe2.title, result3.content[0].title)
    }

    @Test
    fun `getRecipeById throws RecipeNotFoundException when recipe does not exist`() {
        assertEquals(testRecipe.id, recipeService.findById(testRecipe.id).id)

        val nonExistentId = -999
        val exception =
            assertThrows<RecipeNotFoundException> { recipeService.findById(nonExistentId) }

        assertEquals("Recipe with id $nonExistentId not found", exception.message)
    }

    @Test
    fun `createRecipe saves a new recipe`() {
        val createRecipeDTO =
            CreateRecipeDTO(
                title = testRecipe.title,
                description = testRecipe.description,
                ingredients = testRecipe.ingredients,
                cookingTime = testRecipe.cookingTime,
                instructions = testRecipe.instructions,
                servings = testRecipe.servings,
            )

        val createdRecipe = recipeService.createRecipe(testUser, createRecipeDTO, null)
        assertEquals(createRecipeDTO.title, createdRecipe.title)
        assertEquals(createRecipeDTO.description, createdRecipe.description)
        assertEquals(testUser.id, createdRecipe.author.id)
        assertEquals(createRecipeDTO.ingredients, createdRecipe.ingredients)
        assertEquals(createRecipeDTO.cookingTime, createdRecipe.cookingTime)
        assertEquals(createRecipeDTO.instructions, createdRecipe.instructions)
        assertEquals(createRecipeDTO.servings, createdRecipe.servings)
    }

    @Test
    fun `addRating creates new rating to the recipe`() {
        val rating = CreateRecipeRatingDTO(type = RecipeRatingType.DISLIKE)
        val updatedRecipe = recipeService.addRating(testUser, testRecipe.id, rating)
        assertEquals(rating.type, updatedRecipe.ratings[0].type)
    }

    @Test
    fun `updateRating updates the rating of the user`() {
        val rating = CreateRecipeRatingDTO(type = RecipeRatingType.DISLIKE)
        val updatedRecipe = recipeService.addRating(testUser, testRecipe.id, rating)
        assertEquals(rating.type, updatedRecipe.ratings[0].type)

        val updatedRating = CreateRecipeRatingDTO(type = RecipeRatingType.LIKE)
        val updatedRecipe2 = recipeService.updateRating(testUser, testRecipe.id, updatedRating)
        assertEquals(updatedRating.type, updatedRecipe2.ratings[0].type)
    }

    @Test
    fun `addRating does not create a new rating if the user has already rated the recipe`() {
        val rating = CreateRecipeRatingDTO(type = RecipeRatingType.DISLIKE)
        val updatedRecipe = recipeService.addRating(testUser, testRecipe.id, rating)
        assertEquals(testRecipe.ratings.size + 1, updatedRecipe.ratings.size)

        val exception =
            assertThrows<IllegalArgumentException> {
                recipeService.addRating(testUser, testRecipe.id, rating)
            }
        assertEquals("User has already rated this recipe", exception.message)
    }

    @Test
    fun `addComment creates a new comment`() {
        val comment = CreateRecipeCommentDTO(message = "comment")
        val updatedRecipe = recipeService.addComment(testUser, testRecipe.id, comment)

        assertEquals(testRecipe.comments.size + 1, updatedRecipe.comments.size)
        assertEquals(comment.message, updatedRecipe.comments[0].message)
    }
}
