package com.example.demo.recipe.service

import com.example.demo.TextFixtures.recipes
import com.example.demo.TextFixtures.users
import com.example.demo.auth.service.AuthService
import com.example.demo.config.RecipeNotFoundException
import com.example.demo.domain.CurrentUser
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.CreateRecipeRatingDTO
import com.example.demo.recipe.domain.Recipe
import com.example.demo.recipe.domain.RecipeRatingType
import com.example.demo.recipe.repository.RecipeRepository
import com.example.demo.user.domain.User
import com.example.demo.user.repository.UserRepository
import java.time.Instant
import kotlin.test.Test
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.annotation.DirtiesContext

@SpringBootTest
@DirtiesContext
class RecipeServiceIntegrationTest {

    @Autowired private lateinit var reicpeRepository: RecipeRepository
    @Autowired private lateinit var recipeService: RecipeService
    @Autowired private lateinit var userRepository: UserRepository

    @MockBean private lateinit var authService: AuthService

    private lateinit var testUser: User
    private lateinit var testRecipe: Recipe
    private lateinit var testRecipe2: Recipe
    private lateinit var mockCurrentUser: CurrentUser

    @BeforeEach
    fun setup() {
        val user =
            userRepository.createUser(username = users[0].username, email = users[0].email, password = "password")

        mockCurrentUser =
            CurrentUser(exp = Instant.now().plusSeconds(3600 * 10 * 10), sub = user.id, iat = Instant.now())

        `when`(authService.getCurrentUser()).thenReturn(mockCurrentUser)

        val recipe =
            reicpeRepository.createRecipe(
                userId = user.id,
                createRecipeDTO =
                    CreateRecipeDTO(
                        title = recipes[0].title,
                        description = recipes[0].description,
                        ingredients = recipes[0].ingredients,
                        cookingTime = recipes[0].cookingTime,
                        instructions = recipes[0].instructions,
                        servings = recipes[0].servings,
                    ),
                imageName = null,
            )

        val recipe2 =
            reicpeRepository.createRecipe(
                userId = user.id,
                createRecipeDTO =
                    CreateRecipeDTO(
                        title = recipes[1].title,
                        description = recipes[1].description,
                        ingredients = recipes[1].ingredients,
                        cookingTime = recipes[1].cookingTime,
                        instructions = recipes[1].instructions,
                        servings = recipes[1].servings,
                    ),
                imageName = null,
            )

        testUser = user
        testRecipe = recipe
        testRecipe2 = recipe2
    }

    @AfterEach
    fun teardown() {
        userRepository.deleteAll()
    }

    @Test
    fun `getAll returns the right amount of recipes`() {
        val result = recipeService.getAll(recipeTitle = "", page = 1, pageSize = 10, sortBy = "date_asc")
        assertEquals(recipes.size, result.totalElements.toInt())
    }

    @Test
    fun `getAll returns the right amount of recipes when using the title param`() {
        val result = recipeService.getAll(recipeTitle = "", page = 1, pageSize = 10, sortBy = "date_asc")
        assertEquals(recipes.size, result.totalElements.toInt())

        val result2 = recipeService.getAll(recipeTitle = testRecipe.title, page = 1, pageSize = 1, sortBy = "date_asc")
        assertEquals(1, result2.totalElements.toInt())
        assertEquals(testRecipe.title, result2.content[0].title)

        val result3 =
            recipeService.getAll(recipeTitle = testRecipe2.title, page = 1, pageSize = 10, sortBy = "date_asc")
        assertEquals(1, result3.totalElements.toInt())
        assertEquals(testRecipe2.title, result3.content[0].title)
    }

    @Test
    fun `getRecipeById throws RecipeNotFoundException when recipe does not exist`() {
        assertEquals(testRecipe.id, recipeService.findById(testRecipe.id).id)

        val nonExistentId = -999
        val exception = assertThrows<RecipeNotFoundException> { recipeService.findById(nonExistentId) }

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

        val createdRecipe = recipeService.createRecipe(createRecipeDTO, null)
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
        val updatedRecipe = recipeService.createRecipeRating(testRecipe.id, rating)
        assertEquals(rating.type, updatedRecipe.ratings[0].type)
    }

    @Test
    fun `updateRating updates the rating of the user`() {
        val rating = CreateRecipeRatingDTO(type = RecipeRatingType.DISLIKE)
        val updatedRecipe = recipeService.createRecipeRating(testRecipe.id, rating)
        assertEquals(rating.type, updatedRecipe.ratings[0].type)

        val updatedRating = CreateRecipeRatingDTO(type = RecipeRatingType.LIKE)
        val updatedRecipe2 = recipeService.updateRating(testRecipe.id, updatedRating)
        assertEquals(updatedRating.type, updatedRecipe2.ratings[0].type)
    }

    /*
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
    */
}
