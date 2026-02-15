package com.example.demo.recipe.repository

import com.example.demo.config.RecipeNotFoundException
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.Recipe
import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.RecipeComment
import com.example.demo.recipe.domain.RecipeRating
import com.example.demo.recipe.domain.RecipeRatingType
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.jdbc.support.KeyHolder
import org.springframework.stereotype.Repository

@Repository
class RecipeRepository(val jdbcTemplate: NamedParameterJdbcTemplate) {

    @Value("\${recipe.rating.already.exists}") private lateinit var ratingAlreadyExistsQuery: String
    @Value("\${update.recipe_rating}") private lateinit var updateRecipeRatingQuery: String
    @Value("\${create.recipe_rating}") private lateinit var createRecipeRatingQuery: String
    @Value("\${find.recipe_author}") private lateinit var findRecipeAuthorQuery: String
    @Value("\${create.recipe_comment}") private lateinit var createRecipeCommentQuery: String
    @Value("\${find.total.recipes.count}") private lateinit var findRecipesCountQuery: String
    @Value("\${find.recipe_comments.by.recipe_id}") private lateinit var findRecipeCommentsQuery: String
    @Value("\${find.recipe.rating.by.recipe_id.and.author_id}")
    private lateinit var findRecipeRatingByRecipeIdAndAuthorIdQuery: String
    @Value("\${find.recipe.ratings.by.recipe_id}") private lateinit var findRecipeRatingsByRecipeIdQuery: String

    fun fetchRecipes(recipeTitle: String, page: Int, pageSize: Int, sortBy: String): List<Recipe> {
        val params =
            MapSqlParameterSource()
                .addValue("recipeTitle", recipeTitle)
                .addValue("limit", pageSize)
                .addValue("offset", (page - 1) * pageSize)
                .addValue("sortBy", sortBy)

        val sql =
            """
            SELECT 
                r.id AS recipe_id, 
                r.title, 
                r.description, 
                r.image, 
                r.ingredients, 
                r.cooking_time, 
                r.servings, 
                r.instructions, 
                r.category,
                r.created_at, 
                u.id AS user_id, 
                u.username, 
                u.email 
            FROM recipes r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.title ILIKE '%' || :recipeTitle || '%' 
            ORDER BY CASE WHEN :sortBy = 'date_asc' THEN r.created_at END ASC, 
                     CASE WHEN :sortBy = 'date_desc' THEN r.created_at END DESC 
            LIMIT :limit OFFSET :offset
        """
                .trimIndent()

        val recipes =
            jdbcTemplate.query(sql, params) { rs, _ ->
                val recipeId = rs.getInt("recipe_id")
                Recipe(
                    id = rs.getInt("recipe_id"),
                    title = rs.getString("title"),
                    description = rs.getString("description"),
                    image = rs.getString("image"),
                    ingredients = rs.getString("ingredients").split(","),
                    cookingTime = rs.getInt("cooking_time"),
                    servings = rs.getInt("servings"),
                    instructions = rs.getString("instructions"),
                    author = fetchRecipeAuthor(recipeId),
                    createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                    category = rs.getString("category"),
                )
            }

        return recipes
    }

    fun fetchAverageRatingForRecipe(recipeId: Int): Double {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val averageRating =
            jdbcTemplate.queryForObject(
                "SELECT AVG(CASE WHEN type = 'LIKE' THEN 5 WHEN type = 'DISLIKE' THEN 0 END) FROM recipe_ratings WHERE recipe_id = :recipeId",
                params,
                Double::class.java,
            ) ?: 0.0
        return averageRating
    }

    fun fetchTotalRatingsForRecipe(recipeId: Int): Int {
        val params = MapSqlParameterSource("recipeId", recipeId)
        return jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM recipe_ratings WHERE recipe_id = :recipeId AND type = 'LIKE'",
            params,
            Int::class.java,
        ) ?: 0
    }

    fun fetchTotalRecipesCount(recipeTitle: String?): Long {
        return jdbcTemplate.queryForObject(
            findRecipesCountQuery,
            MapSqlParameterSource("recipeTitle", recipeTitle),
            Long::class.java,
        ) ?: 0L
    }

    fun createRecipe(userId: Int, createRecipeDTO: CreateRecipeDTO, imageName: String?): Recipe {
        val params =
            MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("title", createRecipeDTO.title)
                .addValue("description", createRecipeDTO.description)
                .addValue("image", imageName)
                .addValue("ingredients", createRecipeDTO.ingredients.joinToString(","))
                .addValue("cookingTime", createRecipeDTO.cookingTime)
                .addValue("servings", createRecipeDTO.servings)
                .addValue("instructions", createRecipeDTO.instructions)
                .addValue("category", createRecipeDTO.category)

        val sql =
            """
            INSERT INTO recipes (user_id, title, description, image, ingredients, cooking_time, servings, instructions, category, created_at) 
            VALUES (:userId, :title, :description, :image, :ingredients, :cookingTime, :servings, :instructions, :category, NOW())
            """
                .trimIndent()

        val keyHolder: KeyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(sql, params, keyHolder, arrayOf("id"))
        val generatedId = keyHolder.key?.toInt() ?: throw IllegalStateException("No ID returned")

        return findById(generatedId)
    }

    fun createRecipeComment(recipeId: Int, userId: Int, message: String) {
        try {
            val params =
                MapSqlParameterSource()
                    .addValue("recipeId", recipeId)
                    .addValue("userId", userId)
                    .addValue("message", message)

            jdbcTemplate.update(createRecipeCommentQuery, params)
        } catch (e: Exception) {
            throw IllegalStateException("Failed to create comment: ${e.message}", e)
        }
    }

    fun fetchUserRecipes(userId: Int): List<Recipe> {
        val params = MapSqlParameterSource().addValue("userId", userId)
        val sql =
            """
            SELECT r.*, u.id AS user_id, u.username
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE u.id = :userId
            ORDER BY r.created_at DESC
            """
                .trimIndent()

        val recipes =
            jdbcTemplate.query(sql, params) { rs, _ ->
                Recipe(
                    author = RecipeAuthorDTO(id = rs.getInt("user_id"), username = rs.getString("username")),
                    id = rs.getInt("id"),
                    ingredients = rs.getString("ingredients").split(","),
                    cookingTime = rs.getInt("cooking_time"),
                    servings = rs.getInt("servings"),
                    instructions = rs.getString("instructions"),
                    title = rs.getString("title"),
                    description = rs.getString("description"),
                    image = rs.getString("image"),
                    createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                    category = rs.getString("category"),
                )
            }

        return recipes
    }

    fun findById(recipeId: Int): Recipe {
        val params = MapSqlParameterSource("recipeId", recipeId)

        val sql =
            """
            SELECT 
                r.id, 
                r.title, 
                r.description, 
                r.image, 
                r.ingredients, 
                r.cooking_time, 
                r.servings, 
                r.instructions, 
                r.category, 
                r.created_at 
            FROM recipes r 
            WHERE r.id = :recipeId

        """
                .trimIndent()
        val recipe =
            jdbcTemplate
                .query(sql, params) { rs, _ ->
                    Recipe(
                        id = rs.getInt("id"),
                        title = rs.getString("title"),
                        description = rs.getString("description"),
                        image = rs.getString("image"),
                        ingredients = rs.getString("ingredients").split(","),
                        cookingTime = rs.getInt("cooking_time"),
                        servings = rs.getInt("servings"),
                        instructions = rs.getString("instructions"),
                        author = fetchRecipeAuthor(rs.getInt("id")),
                        createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                        category = rs.getString("category"),
                    )
                }
                .firstOrNull()

        return recipe ?: throw RecipeNotFoundException(recipeId.toString())
    }

    fun fetchRecipeRatings(recipeId: Int): List<RecipeRating> {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val ratings =
            jdbcTemplate.query(findRecipeRatingsByRecipeIdQuery, params) { rs, _ ->
                RecipeRating(
                    id = rs.getInt("rating_id"),
                    type = RecipeRatingType.valueOf(rs.getString("rating_type")),
                    author = RecipeAuthorDTO(id = rs.getInt("user_id"), username = rs.getString("username")),
                )
            }

        return ratings
    }

    fun existsByRecipeIdAndAuthorId(recipeId: Int, userId: Int): Boolean {
        val count =
            jdbcTemplate.queryForObject(
                ratingAlreadyExistsQuery,
                MapSqlParameterSource().addValue("recipeId", recipeId).addValue("userId", userId),
                Int::class.java,
            ) ?: 0
        return count > 0
    }

    fun findRecipeRatingByRecipeIdAndAuthorId(recipeId: Int, userId: Int): RecipeRating? {
        val params = MapSqlParameterSource().addValue("recipeId", recipeId).addValue("userId", userId)

        return jdbcTemplate
            .query(findRecipeRatingByRecipeIdAndAuthorIdQuery, params) { rs, _ ->
                RecipeRating(
                    id = rs.getInt("rating_id"),
                    type = RecipeRatingType.valueOf(rs.getString("rating_type")),
                    author = RecipeAuthorDTO(id = rs.getInt("author_id"), username = rs.getString("author_username")),
                )
            }
            .firstOrNull()
    }

    fun updateRecipeRating(ratingId: Int, type: RecipeRatingType) {
        val params = MapSqlParameterSource()
        params.addValue("ratingId", ratingId)
        params.addValue("type", type.name)

        jdbcTemplate.update(updateRecipeRatingQuery, params)
    }

    fun createRecipeRating(recipeId: Int, userId: Int, type: RecipeRatingType) {
        val params =
            MapSqlParameterSource()
                .addValue("recipeId", recipeId)
                .addValue("userId", userId)
                .addValue("type", type.name)

        jdbcTemplate.update(createRecipeRatingQuery, params)
    }

    private fun fetchRecipeAuthor(recipeId: Int): RecipeAuthorDTO {
        val params = MapSqlParameterSource("recipeId", recipeId)
        return jdbcTemplate.queryForObject(findRecipeAuthorQuery, params) { rs, _ ->
            RecipeAuthorDTO(id = rs.getInt("id"), username = rs.getString("username"))
        } ?: throw IllegalStateException("Author not found for recipe id: $recipeId")
    }

    fun fetchRecipeComments(recipeId: Int): List<RecipeComment> {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val comments =
            jdbcTemplate.query(findRecipeCommentsQuery, params) { rs, _ ->
                RecipeComment(
                    id = rs.getInt("comment_id"),
                    message = rs.getString("comment_message"),
                    createdAt = rs.getTimestamp("comment_created_at").toLocalDateTime(),
                    author = RecipeAuthorDTO(id = rs.getInt("author_id"), username = rs.getString("author_username")),
                )
            }

        return comments
    }
}
