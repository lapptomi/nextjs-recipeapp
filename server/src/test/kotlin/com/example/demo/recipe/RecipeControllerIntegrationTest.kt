package com.example.demo.recipe

import com.example.demo.ApiPath
import com.example.demo.TextFixtures.recipes
import com.example.demo.TextFixtures.users
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.Recipe
import com.example.demo.recipe.repository.RecipeRepository
import com.example.demo.user.domain.User
import com.example.demo.user.repository.UserRepository
import kotlin.test.Test
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@DirtiesContext
@SpringBootTest
@AutoConfigureMockMvc
class RecipeControllerIntegrationTest {

    @Autowired private lateinit var mockMvc: MockMvc
    @Autowired private lateinit var recipeRepository: RecipeRepository
    @Autowired private lateinit var userRepository: UserRepository

    private lateinit var testUser: User
    private lateinit var testRecipe: Recipe

    @BeforeEach
    fun setUp() {
        val user =
            userRepository.createUser(
                username = users[0].username,
                password = "randomPassword",
                email = "hello@world.com",
            )

        val recipe =
            recipeRepository.createRecipe(
                userId = user.id,
                createRecipeDTO =
                    CreateRecipeDTO(
                        title = recipes[0].title,
                        description = recipes[0].description,
                        ingredients = recipes[0].ingredients,
                        cookingTime = recipes[0].cookingTime,
                        servings = recipes[0].servings,
                        instructions = recipes[0].instructions,
                    ),
                imageName = null,
            )
        testUser = user
        testRecipe = recipe
    }

    @AfterEach
    fun teardown() {
        userRepository.deleteAll()
    }

    @Test
    fun `getRecipeById should return recipe when recipe exists`() {
        mockMvc
            .perform(get(ApiPath.RECIPES_API + "/{id}", testRecipe.id).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(testRecipe.id))
            .andExpect(jsonPath("$.title").value(testRecipe.title))
            .andExpect(jsonPath("$.description").value(testRecipe.description))
            .andExpect(jsonPath("$.ingredients").exists())
            .andExpect(jsonPath("$.cookingTime").value(testRecipe.cookingTime))
            .andExpect(jsonPath("$.servings").value(testRecipe.servings))
            .andExpect(jsonPath("$.author").exists())
            .andExpect(jsonPath("$.author.id").value(testUser.id))
            .andExpect(jsonPath("$.image").value(testRecipe.image))
            .andExpect(jsonPath("$.createdAt").exists())
            .andExpect(jsonPath("$.comments").exists())
            .andExpect(jsonPath("$.ratings").exists())
    }
}
