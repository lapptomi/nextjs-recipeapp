package com.example.demo.recipe

import com.example.demo.config.RecipeNotFoundException
import com.example.demo.recipe.domain.CreateRecipeRequest
import com.example.demo.recipe.domain.Recipe
import com.example.demo.recipe.domain.RecipeAuthor
import com.example.demo.recipe.domain.RecipeComment
import com.example.demo.recipe.domain.RecipeDetail
import com.example.demo.recipe.domain.RecipeListItem
import com.example.demo.recipe.domain.RecipePage
import com.example.demo.recipe.domain.RecipeRating
import com.example.demo.recipe.domain.RecipeRatingType
import java.sql.Types
import org.springframework.jdbc.core.DataClassRowMapper
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.jdbc.support.KeyHolder
import org.springframework.stereotype.Repository

private val recipeRowMapper = DataClassRowMapper(Recipe::class.java)

private val recipeListItemRowMapper = DataClassRowMapper(RecipeListItem::class.java)

private val recipeRatingRowMapper =
    RowMapper<RecipeRating> { rs, _ ->
        RecipeRating(
            id = rs.getInt("rating_id"),
            type = RecipeRatingType.valueOf(rs.getString("rating_type")),
            author = RecipeAuthor(id = rs.getInt("author_id"), username = rs.getString("author_username")),
        )
    }

@Repository
class RecipeRepository(private val jdbcTemplate: NamedParameterJdbcTemplate) {

    fun fetchRecipesByPage(
        recipeTitle: String,
        category: String?,
        page: Int,
        pageSize: Int,
        sortBy: String,
    ): RecipePage {
        val filterParams =
            MapSqlParameterSource().addValue("recipeTitle", recipeTitle).addValue("category", category, Types.VARCHAR)

        val whereClause =
            "r.title ILIKE '%' || :recipeTitle || '%' AND (:category IS NULL OR LOWER(r.category) = LOWER(:category))"

        val totalCount =
            jdbcTemplate.queryForObject(
                "SELECT COUNT(DISTINCT r.id) FROM recipes r WHERE $whereClause",
                filterParams,
                Long::class.java,
            )

        val params =
            filterParams
                .addValue("limit", pageSize)
                .addValue("offset", (page - 1) * pageSize)
                .addValue("sortBy", sortBy)

        val sql =
            """
            SELECT r.id, r.title, r.description, r.image, r.cooking_time, r.servings, r.category, r.user_id, r.created_at, u.id AS author_id, u.username AS author_username,
                   COUNT(rr.id) AS total_ratings,
                   COALESCE(AVG(CASE WHEN rr.type = 'LIKE' THEN 5 WHEN rr.type = 'DISLIKE' THEN 0 END), 0.0) AS average_rating
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_ratings rr ON rr.recipe_id = r.id
            WHERE $whereClause
            GROUP BY r.id, u.id
            ORDER BY CASE WHEN :sortBy = 'date_asc' THEN r.created_at END ASC,
                     CASE WHEN :sortBy = 'date_desc' THEN r.created_at END DESC
            LIMIT :limit OFFSET :offset
            """
                .trimIndent()

        val items = jdbcTemplate.query(sql, params, recipeListItemRowMapper)

        return RecipePage(items = items, totalCount = totalCount ?: 0)
    }

    fun createRecipe(userId: Int, createRecipeDTO: CreateRecipeRequest): RecipeDetail {
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

        return findRecipeWithDetailsById(generatedId)
    }

    fun createRecipeComment(recipeId: Int, userId: Int, message: String) {
        try {
            val params =
                MapSqlParameterSource()
                    .addValue("recipeId", recipeId)
                    .addValue("userId", userId)
                    .addValue("message", message)

            jdbcTemplate.update(
                "INSERT INTO recipe_comments (recipe_id, user_id, message, created_at) VALUES (:recipeId, :userId, :message, NOW())",
                params,
            )
        } catch (e: Exception) {
            throw IllegalStateException("Failed to create comment: ${e.message}", e)
        }
    }

    fun fetchUserRecipesWithStats(userId: Int): List<RecipeListItem> {
        val params = MapSqlParameterSource("userId", userId)
        val sql =
            """
            SELECT r.id, r.title, r.description, r.image, r.cooking_time, r.servings, r.category, r.user_id, r.created_at, u.id AS author_id, u.username AS author_username,
                   COUNT(rr.id) AS total_ratings,
                   COALESCE(AVG(CASE WHEN rr.type = 'LIKE' THEN 5 WHEN rr.type = 'DISLIKE' THEN 0 END), 0.0) AS average_rating
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_ratings rr ON rr.recipe_id = r.id
            WHERE r.user_id = :userId
            GROUP BY r.id, u.id
            ORDER BY r.created_at DESC
            """
                .trimIndent()

        return jdbcTemplate.query(sql, params, recipeListItemRowMapper)
    }

    fun findRecipeWithDetailsById(recipeId: Int): RecipeDetail {
        val params = MapSqlParameterSource("recipeId", recipeId)

        val recipe =
            jdbcTemplate
                .query(
                    "SELECT id, title, description, image, cooking_time, servings, instructions, category, user_id, created_at FROM recipes WHERE id = :recipeId",
                    params,
                    recipeRowMapper,
                )
                .firstOrNull() ?: throw RecipeNotFoundException(recipeId.toString())

        val author =
            jdbcTemplate.queryForObject(
                "SELECT id, username FROM users WHERE id = :userId",
                MapSqlParameterSource("userId", recipe.userId),
            ) { rs, _ ->
                RecipeAuthor(rs.getInt("id"), rs.getString("username"))
            }!!

        val ingredients =
            jdbcTemplate.queryForList(
                "SELECT ingredient FROM recipe_ingredients WHERE recipe_id = :recipeId ORDER BY id",
                params,
                String::class.java,
            )

        val comments =
            jdbcTemplate.query(
                "SELECT c.id AS comment_id, c.message, c.created_at AS comment_created_at, u.id AS author_id, u.username AS author_username FROM recipe_comments c JOIN users u ON c.user_id = u.id WHERE c.recipe_id = :recipeId",
                params,
            ) { rs, _ ->
                RecipeComment(
                    id = rs.getInt("comment_id"),
                    message = rs.getString("message"),
                    createdAt = rs.getTimestamp("comment_created_at").toLocalDateTime(),
                    author = RecipeAuthor(rs.getInt("author_id"), rs.getString("author_username")),
                )
            }

        val ratings =
            jdbcTemplate.query(
                "SELECT rr.id AS rating_id, rr.type AS rating_type, u.id AS author_id, u.username AS author_username FROM recipe_ratings rr JOIN users u ON rr.user_id = u.id WHERE rr.recipe_id = :recipeId",
                params,
                recipeRatingRowMapper,
            )

        return RecipeDetail(
            id = recipe.id,
            title = recipe.title,
            description = recipe.description,
            image = recipe.image,
            cookingTime = recipe.cookingTime,
            servings = recipe.servings,
            instructions = recipe.instructions,
            userId = recipe.userId,
            createdAt = recipe.createdAt,
            category = recipe.category,
            author = author,
            ingredients = ingredients,
            comments = comments,
            ratings = ratings,
        )
    }

    fun existsByRecipeIdAndAuthorId(recipeId: Int, userId: Int): Boolean {
        val count =
            jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM recipe_ratings WHERE recipe_id = :recipeId AND user_id = :userId",
                MapSqlParameterSource().addValue("recipeId", recipeId).addValue("userId", userId),
                Int::class.java,
            )
        if (count == null) throw IllegalStateException("Failed to check recipe rating")
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

        return jdbcTemplate.query(sql, params, recipeRatingRowMapper).firstOrNull()
    }

    fun updateRecipeRating(ratingId: Int, type: RecipeRatingType) {
        val params = MapSqlParameterSource()
        params.addValue("ratingId", ratingId)
        params.addValue("type", type.name)
        jdbcTemplate.update("UPDATE recipe_ratings SET type = :type WHERE id = :ratingId", params)
    }

    fun createRecipeRating(recipeId: Int, userId: Int, type: RecipeRatingType) {
        val params =
            MapSqlParameterSource()
                .addValue("recipeId", recipeId)
                .addValue("userId", userId)
                .addValue("type", type.name)

        jdbcTemplate.update(
            "INSERT INTO recipe_ratings (recipe_id, user_id, type) VALUES (:recipeId, :userId, :type)",
            params,
        )
    }

    fun updateRecipeImage(recipeId: Int, imageName: String) {
        val params = MapSqlParameterSource().addValue("recipeId", recipeId).addValue("image", imageName)
        jdbcTemplate.update("UPDATE recipes SET image = :image WHERE id = :recipeId", params)
    }

    private fun insertIngredients(recipeId: Int, ingredients: List<String>) {
        val batchParams =
            ingredients
                .map { ingredient ->
                    MapSqlParameterSource().addValue("recipeId", recipeId).addValue("ingredient", ingredient)
                }
                .toTypedArray()
        jdbcTemplate.batchUpdate(
            "INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES (:recipeId, :ingredient)",
            batchParams,
        )
    }
}
