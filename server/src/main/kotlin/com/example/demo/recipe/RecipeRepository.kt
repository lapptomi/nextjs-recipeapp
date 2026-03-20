package com.example.demo.recipe

import com.example.demo.config.RecipeNotFoundException
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.Recipe
import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.RecipeComment
import com.example.demo.recipe.domain.RecipeRating
import com.example.demo.recipe.domain.RecipeRatingType
import java.sql.Types
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.DataClassRowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.jdbc.support.KeyHolder
import org.springframework.stereotype.Repository

@Repository
class RecipeRepository(val jdbcTemplate: NamedParameterJdbcTemplate) {

    fun fetchRecipes(recipeTitle: String, category: String?, page: Int, pageSize: Int, sortBy: String): List<Recipe> {
        val params =
            MapSqlParameterSource()
                .addValue("recipeTitle", recipeTitle)
                .addValue("category", category, Types.VARCHAR)
                .addValue("limit", pageSize)
                .addValue("offset", (page - 1) * pageSize)
                .addValue("sortBy", sortBy)

        val sql =
            """
            SELECT id, title, description, image, cooking_time, servings, instructions,
                   category, user_id, created_at
            FROM recipes
            WHERE title ILIKE '%' || :recipeTitle || '%'
              AND (:category IS NULL OR LOWER(category) = LOWER(:category))
            ORDER BY CASE WHEN :sortBy = 'date_asc' THEN created_at END ASC,
                     CASE WHEN :sortBy = 'date_desc' THEN created_at END DESC
            LIMIT :limit OFFSET :offset
            """
                .trimIndent()

        return jdbcTemplate.query(sql, params, DataClassRowMapper(Recipe::class.java))
    }

    fun fetchAverageRatingForRecipe(recipeId: Int): Double {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val sql =
            "SELECT AVG(CASE WHEN type = 'LIKE' THEN 5 WHEN type = 'DISLIKE' THEN 0 END) FROM recipe_ratings WHERE recipe_id = :recipeId"
        return jdbcTemplate.queryForObject(sql, params, Double::class.java) ?: 0.0
    }

    fun fetchTotalRatingsForRecipe(recipeId: Int): Int {
        val sql = "SELECT COUNT(*) FROM recipe_ratings WHERE recipe_id = :recipeId"
        val params = MapSqlParameterSource("recipeId", recipeId)
        return jdbcTemplate.queryForObject(sql, params, Int::class.java) ?: 0
    }

    fun fetchTotalRecipesCount(recipeTitle: String, category: String?): Long {
        val sql =
            "SELECT COUNT(*) FROM recipes WHERE title ILIKE '%' || :recipeTitle || '%' AND (:category IS NULL OR LOWER(category) = LOWER(:category))"
        val params =
            MapSqlParameterSource().addValue("recipeTitle", recipeTitle).addValue("category", category, Types.VARCHAR)

        return jdbcTemplate.queryForObject(sql, params, Long::class.java) ?: 0L
    }

    fun createRecipe(userId: Int, createRecipeDTO: CreateRecipeDTO): Recipe {
        val params =
            MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("title", createRecipeDTO.title)
                .addValue("description", createRecipeDTO.description)
                .addValue("cookingTime", createRecipeDTO.cookingTime)
                .addValue("servings", createRecipeDTO.servings)
                .addValue("instructions", createRecipeDTO.instructions)
                .addValue("category", createRecipeDTO.category)

        val sql =
            """
            INSERT INTO recipes (user_id, title, description, cooking_time, servings, instructions, category, created_at)
            VALUES (:userId, :title, :description, :cookingTime, :servings, :instructions, :category, NOW())
            """
                .trimIndent()

        val keyHolder: KeyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(sql, params, keyHolder, arrayOf("id"))
        val generatedId = keyHolder.key?.toInt() ?: throw IllegalStateException("No ID returned")

        insertIngredients(generatedId, createRecipeDTO.ingredients)

        return findByIdOrNull(generatedId)
            ?: throw IllegalStateException("Recipe was created but could not be loaded by id: $generatedId")
    }

    fun createRecipeComment(recipeId: Int, userId: Int, message: String) {
        try {
            val params =
                MapSqlParameterSource()
                    .addValue("recipeId", recipeId)
                    .addValue("userId", userId)
                    .addValue("message", message)
            val sql =
                "INSERT INTO recipe_comments (recipe_id, user_id, message, created_at) VALUES (:recipeId, :userId, :message, NOW())"

            jdbcTemplate.update(sql, params)
        } catch (e: Exception) {
            throw IllegalStateException("Failed to create comment: ${e.message}", e)
        }
    }

    fun fetchUserRecipes(userId: Int): List<Recipe> {
        val params = MapSqlParameterSource().addValue("userId", userId)
        val sql =
            """
            SELECT id, title, description, image, cooking_time, servings, instructions, category, user_id, created_at
            FROM recipes
            WHERE user_id = :userId
            ORDER BY created_at DESC
            """

        return jdbcTemplate.query(sql, params, DataClassRowMapper(Recipe::class.java))
    }

    fun findByIdOrNull(recipeId: Int): Recipe? {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val sql =
            """
            SELECT id, title, description, image, cooking_time, servings, instructions, category, user_id, created_at
            FROM recipes
            WHERE id = :recipeId
            """

        return try {
            jdbcTemplate.queryForObject(sql, params, DataClassRowMapper(Recipe::class.java))
        } catch (e: EmptyResultDataAccessException) {
            throw RecipeNotFoundException(recipeId.toString())
        }
    }

    fun fetchRecipeRatings(recipeId: Int): List<RecipeRating> {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val sql =
            """
            SELECT rating.id AS rating_id, rating.type AS rating_type,
                   u.id AS user_id, u.username AS username
            FROM recipe_ratings rating
            JOIN users u ON rating.user_id = u.id
            WHERE rating.recipe_id = :recipeId
            """
                .trimIndent()

        return jdbcTemplate.query(sql, params) { rs, _ ->
            RecipeRating(
                id = rs.getInt("rating_id"),
                type = RecipeRatingType.valueOf(rs.getString("rating_type")),
                author = RecipeAuthorDTO(id = rs.getInt("user_id"), username = rs.getString("username")),
            )
        }
    }

    fun existsByRecipeIdAndAuthorId(recipeId: Int, userId: Int): Boolean {
        val sql = "SELECT COUNT(*) FROM recipe_ratings WHERE recipe_id = :recipeId AND user_id = :userId"
        val count =
            jdbcTemplate.queryForObject(
                sql,
                MapSqlParameterSource().addValue("recipeId", recipeId).addValue("userId", userId),
                Int::class.java,
            )
        if (count == null) {
            throw IllegalStateException("Failed to check if rating exists for recipeId: $recipeId and userId: $userId")
        }
        return count > 0
    }

    fun findRecipeRatingByRecipeIdAndAuthorId(recipeId: Int, userId: Int): RecipeRating? {
        val params = MapSqlParameterSource().addValue("recipeId", recipeId).addValue("userId", userId)
        val sql =
            """
            SELECT rating.id AS rating_id, rating.type AS rating_type,
                   u.id AS author_id, u.username AS author_username
            FROM recipe_ratings rating
            JOIN users u ON rating.user_id = u.id
            WHERE rating.recipe_id = :recipeId AND rating.user_id = :userId
            """
                .trimIndent()

        return jdbcTemplate
            .query(sql, params) { rs, _ ->
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
        val sql = "UPDATE recipe_ratings SET type = :type WHERE id = :ratingId"

        jdbcTemplate.update(sql, params)
    }

    fun createRecipeRating(recipeId: Int, userId: Int, type: RecipeRatingType) {
        val params =
            MapSqlParameterSource()
                .addValue("recipeId", recipeId)
                .addValue("userId", userId)
                .addValue("type", type.name)
        val sql = "INSERT INTO recipe_ratings (recipe_id, user_id, type) VALUES (:recipeId, :userId, :type)"

        jdbcTemplate.update(sql, params)
    }

    fun updateRecipeImage(recipeId: Int, imageName: String) {
        val params = MapSqlParameterSource().addValue("recipeId", recipeId).addValue("image", imageName)
        val sql = "UPDATE recipes SET image = :image WHERE id = :recipeId"

        jdbcTemplate.update(sql, params)
    }

    fun fetchIngredientsByRecipeId(recipeId: Int): List<String> {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val sql = "SELECT ingredient FROM recipe_ingredients WHERE recipe_id = :recipeId ORDER BY id"
        return jdbcTemplate.queryForList(sql, params, String::class.java)
    }

    fun fetchAuthorByUserId(userId: Int): RecipeAuthorDTO {
        val params = MapSqlParameterSource("userId", userId)
        val sql = "SELECT id, username FROM users WHERE id = :userId"

        return jdbcTemplate.queryForObject(sql, params) { rs, _ ->
            RecipeAuthorDTO(id = rs.getInt("id"), username = rs.getString("username"))
        } ?: throw IllegalStateException("Author not found for user id: $userId")
    }

    private fun insertIngredients(recipeId: Int, ingredients: List<String>) {
        val sql = "INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES (:recipeId, :ingredient)"
        val batchParams =
            ingredients
                .map { ingredient ->
                    MapSqlParameterSource().addValue("recipeId", recipeId).addValue("ingredient", ingredient)
                }
                .toTypedArray()
        jdbcTemplate.batchUpdate(sql, batchParams)
    }

    fun fetchRecipeComments(recipeId: Int): List<RecipeComment> {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val sql =
            """
            SELECT c.id AS comment_id, c.message AS comment_message, c.created_at AS comment_created_at,
                   u.id AS author_id, u.username AS author_username
            FROM recipe_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.recipe_id = :recipeId
            """
                .trimIndent()

        return jdbcTemplate.query(sql, params) { rs, _ ->
            RecipeComment(
                id = rs.getInt("comment_id"),
                message = rs.getString("comment_message"),
                createdAt = rs.getTimestamp("comment_created_at").toLocalDateTime(),
                author = RecipeAuthorDTO(id = rs.getInt("author_id"), username = rs.getString("author_username")),
            )
        }
    }
}
