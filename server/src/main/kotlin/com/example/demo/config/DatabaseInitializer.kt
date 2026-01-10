package com.example.demo.config

/*
@Configuration
class DatabaseInitializer(
    private val securityConfig: SecurityConfig
    // private val userRepository: UserRepository,
    // private val recipeRepository: RecipeRepository,
    // private val recipeRatingRepository: RecipeRatingRepository,
    // private val recipeCommentRepository: RecipeCommentRepository,
) {
    @Profile("dev")
    @Bean
    fun addInitialData(): CommandLineRunner {
        /*
        return CommandLineRunner {
            val users = createUsers()
            val recipes = createRecipes(users)
            val recipeComments = createRecipeComments(users, recipes)

            if (userRepository.count() == 0L) userRepository.saveAll(users)
            if (recipeRepository.count() == 0L) recipeRepository.saveAll(recipes)
            if (recipeCommentRepository.count() == 0L)
                recipeCommentRepository.saveAll(recipeComments)
        }

         */
        return CommandLineRunner {}
    }

    private fun createUsers(): List<UserOLD> {
        fun encodePassword(password: String) = securityConfig.passwordEncoder().encode(password)
        return (0..10)
            .map {
                UserOLD(username = "User $it", email = "user$it", password = encodePassword("user$it"))
            }
            .plus(UserOLD(username = "admin", email = "admin", password = encodePassword("admin")))
    }

    private fun createRecipes(users: List<UserOLD>): List<Recipe> {
        fun generateRandomString(length: Int): String =
            (1..length).map { ('a'..'z').random() }.joinToString("")
        return (0..20).map {
            Recipe(
                author = users[0],
                title = "Recipe $it",
                description = generateRandomString(500),
                ingredients = (0..5).map { "Ingredient $it" },
                cookingTime = 10,
                servings = 2,
                instructions = generateRandomString(500),
                image = null,
            )
        }
    }

    private fun createRecipeComments(
        users: List<UserOLD>,
        recipes: List<Recipe>,
    ): List<RecipeComment> {
        fun generateRandomString(length: Int): String =
            (1..length).map { ('a'..'z').random() }.joinToString("")
        return (0..10).map {
            RecipeComment(
                author = users[0],
                message = generateRandomString(500),
                recipe = recipes[0],
            )
        }
    }
}

 */
