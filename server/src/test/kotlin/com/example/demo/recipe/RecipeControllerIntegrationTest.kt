package com.example.demo.recipe

import com.example.demo.ApiPath
import com.example.demo.TextFixtures.recipes
import com.example.demo.TextFixtures.users
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/*
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
        val user = userRepository.save(users[0])
        val recipe = recipeRepository.save(recipes[0].copy(author = user))
        testUser = user
        testRecipe = recipe
    }

    @AfterEach
    fun teardown() {
        userRepository.deleteAll()
        recipeRepository.deleteAll()
    }

    @Test
    fun `getRecipeById should return recipe when recipe exists`() {
        mockMvc
            .perform(
                get(ApiPath.RECIPES_API + "/{id}", testRecipe.id)
                    .contentType(MediaType.APPLICATION_JSON)
            )
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

 */
