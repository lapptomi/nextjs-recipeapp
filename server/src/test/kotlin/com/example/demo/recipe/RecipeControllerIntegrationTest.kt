package com.example.demo.recipe

import com.example.demo.ApiPath
import com.example.demo.TextFixtures.recipes
import com.example.demo.TextFixtures.users
import com.example.demo.recipe.mapper.RecipeMapper
import com.example.demo.recipe.service.RecipeService
import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class RecipeControllerIntegrationTest {

    @Autowired private lateinit var mockMvc: MockMvc

    @MockBean private lateinit var recipeService: RecipeService

    @Autowired private lateinit var recipeMapper: RecipeMapper

    private lateinit var testUser: User
    private lateinit var testRecipe: Recipe

    @BeforeEach
    fun setUp() {
        testUser = users[0]
        testRecipe = recipes[0]
    }

    @Test
    fun `getRecipeById should return recipe when recipe exists`() {
        val recipeId = 1
        `when`(recipeService.findById(recipeId)).thenReturn(recipeMapper.toDTO(testRecipe))

        mockMvc
            .perform(
                get(ApiPath.RECIPES_API + "/{id}", recipeId).contentType(MediaType.APPLICATION_JSON)
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
