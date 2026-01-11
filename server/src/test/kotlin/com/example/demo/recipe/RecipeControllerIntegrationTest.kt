package com.example.demo.recipe

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get


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
