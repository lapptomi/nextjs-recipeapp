package com.example.demo.recipe.repository

import com.example.demo.config.RecipeNotFoundException
import com.example.demo.recipe.domain.CreateRecipeDTO
import com.example.demo.recipe.domain.Recipe
import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.RecipeComment
import com.example.demo.recipe.domain.RecipeRating
import com.example.demo.recipe.domain.RecipeRatingType
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.jdbc.support.KeyHolder
import org.springframework.stereotype.Repository

@Repository
class RecipeRepository(val jdbcTemplate: NamedParameterJdbcTemplate) {

    fun fetchRecipes(recipeTitle: String, page: Int, pageSize: Int, sortBy: String): List<Recipe> {
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
                r.created_at,
                u.id AS user_id, 
                u.username,
                u.email
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE r.title ILIKE '%' || :recipeTitle || '%'
            ORDER BY r.created_at ${if (sortBy == "date_asc") "ASC" else "DESC"}
            LIMIT :limit OFFSET :offset
            """

        val params =
            MapSqlParameterSource()
                .addValue("recipeTitle", recipeTitle)
                .addValue("limit", pageSize)
                .addValue("offset", (page - 1) * pageSize)

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
                )
            }

        return recipes
    }

    fun fetchTotalRecipesCount(recipeTitle: String?): Long {
        return jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM recipes WHERE title ILIKE '%' || :recipeTitle || '%'",
            MapSqlParameterSource("recipeTitle", recipeTitle),
            Long::class.java,
        ) ?: 0L
    }

    fun createRecipe(userId: Int, createRecipeDTO: CreateRecipeDTO, imageName: String?): Recipe {
        val sql =
            """
            INSERT INTO recipes (user_id, title, description, image, ingredients, cooking_time, servings, instructions, created_at)
            VALUES (:userId, :title, :description, :image, :ingredients, :cookingTime, :servings, :instructions, NOW())
            """

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

        val keyHolder: KeyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(sql, params, keyHolder, arrayOf("id"))
        val generatedId = keyHolder.key?.toInt() ?: throw IllegalStateException("No ID returned")

        return findById(generatedId)
    }

    fun createRecipeComment(recipeId: Int, userId: Int, message: String) {
        try {
            val sql =
                """
                INSERT INTO recipe_comments (recipe_id, user_id, message, created_at)
                VALUES (:recipeId, :userId, :message, NOW())
                """

            val params =
                MapSqlParameterSource()
                    .addValue("recipeId", recipeId)
                    .addValue("userId", userId)
                    .addValue("message", message)

            jdbcTemplate.update(sql, params)
        } catch (e: Exception) {
            throw IllegalStateException("Failed to create comment: ${e.message}", e)
        }
    }

    fun fetchUserRecipes(userId: Int): List<Recipe> {
        val sql =
            """
        SELECT
            id,
            title,
            description,
            image,
            ingredients,
            cooking_time,
            servings,
            instructions,
            created_at
        FROM recipes
        WHERE user_id = :userId
        ORDER BY created_at DESC
    """

        val params = MapSqlParameterSource().addValue("userId", userId)

        return jdbcTemplate.query(sql, params) { rs, _ ->
            Recipe(
                author = fetchRecipeAuthor(userId),
                id = rs.getInt("id"),
                ingredients = rs.getString("ingredients").split(","),
                cookingTime = rs.getInt("cooking_time"),
                servings = rs.getInt("servings"),
                instructions = rs.getString("instructions"),
                title = rs.getString("title"),
                description = rs.getString("description"),
                image = rs.getString("image"),
                createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
            )
        }
    }

    fun findById(recipeId: Int): Recipe {
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
                r.created_at
            FROM recipes r
            WHERE r.id = :recipeId
            """

        val params = MapSqlParameterSource("recipeId", recipeId)
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
                    )
                }
                .firstOrNull()

        return recipe ?: throw RecipeNotFoundException("Recipe not found with id: $recipeId")
    }

    fun fetchRecipeRatings(recipeId: Int): List<RecipeRating> {
        val params = MapSqlParameterSource("recipeId", recipeId)
        val ratings =
            jdbcTemplate.query(
                """
                SELECT
                    rating.id AS rating_id,
                    rating.type AS rating_type,
                    u.id AS user_id,
                    u.username AS username
                FROM recipe_ratings rating
                JOIN users u ON rating.user_id = u.id
                WHERE rating.recipe_id = :recipeId
                """,
                params,
            ) { rs, _ ->
                RecipeRating(
                    id = rs.getInt("rating_id"),
                    type = RecipeRatingType.valueOf(rs.getString("rating_type")),
                    author =
                        RecipeAuthorDTO(
                            id = rs.getInt("user_id"),
                            username = rs.getString("username"),
                        ),
                )
            }

        return ratings
    }

    fun existsByRecipeIdAndAuthorId(recipeId: Int, userId: Int): Boolean {
        val sql =
            """
            SELECT COUNT(*) FROM recipe_ratings
            WHERE recipe_id = :recipeId AND user_id = :userId
            """

        val params =
            MapSqlParameterSource().addValue("recipeId", recipeId).addValue("userId", userId)
        val count = jdbcTemplate.queryForObject(sql, params, Int::class.java) ?: 0
        return count > 0
    }

    fun findRecipeRatingByRecipeIdAndAuthorId(recipeId: Int, userId: Int): RecipeRating? {
        val sql =
            """
            SELECT
                rating.id AS rating_id,
                rating.type AS rating_type,
                u.id AS author_id,
                u.username AS author_username
            FROM recipe_ratings rating
            JOIN users u ON rating.user_id = u.id
            WHERE rating.recipe_id = :recipeId AND rating.user_id = :userId

            """

        val params =
            MapSqlParameterSource().addValue("recipeId", recipeId).addValue("userId", userId)

        return jdbcTemplate
            .query(sql, params) { rs, _ ->
                RecipeRating(
                    id = rs.getInt("rating_id"),
                    type = RecipeRatingType.valueOf(rs.getString("rating_type")),
                    author =
                        RecipeAuthorDTO(
                            id = rs.getInt("author_id"),
                            username = rs.getString("author_username"),
                        ),
                )
            }
            .firstOrNull()
    }

    fun updateRecipeRating(ratingId: Int, type: RecipeRatingType) {
        val sql =
            """
            UPDATE recipe_ratings
            SET type = :type
            WHERE id = :ratingId
            """

        val params =
            MapSqlParameterSource().addValue("ratingId", ratingId).addValue("type", type.name)

        jdbcTemplate.update(sql, params)
    }

    fun createRecipeRating(recipeId: Int, userId: Int, type: RecipeRatingType) {
        val sql =
            """
            INSERT INTO recipe_ratings (recipe_id, user_id, type)
            VALUES (:recipeId, :userId, :type)
            """

        val params =
            MapSqlParameterSource()
                .addValue("recipeId", recipeId)
                .addValue("userId", userId)
                .addValue("type", type.name)

        jdbcTemplate.update(sql, params)
    }

    private fun fetchRecipeAuthor(recipeId: Int): RecipeAuthorDTO {
        val authorSql =
            """
            SELECT u.id, u.username
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = :recipeId
            """

        val params = MapSqlParameterSource("recipeId", recipeId)
        return jdbcTemplate.queryForObject(authorSql, params) { rs, _ ->
            RecipeAuthorDTO(id = rs.getInt("id"), username = rs.getString("username"))
        } ?: throw IllegalStateException("Author not found for recipe id: $recipeId")
    }

    fun fetchRecipeComments(recipeId: Int): List<RecipeComment> {
        val commentsSql =
            """
            SELECT
                c.id AS comment_id,
                c.message AS comment_message,
                c.created_at AS comment_created_at,
                u.id AS author_id,
                u.username AS author_username
            FROM recipe_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.recipe_id = :recipeId

            """

        val params = MapSqlParameterSource("recipeId", recipeId)
        val comments =
            jdbcTemplate.query(commentsSql, params) { rs, _ ->
                RecipeComment(
                    id = rs.getInt("comment_id"),
                    message = rs.getString("comment_message"),
                    createdAt = rs.getTimestamp("comment_created_at").toLocalDateTime(),
                    author =
                        RecipeAuthorDTO(
                            id = rs.getInt("author_id"),
                            username = rs.getString("author_username"),
                        ),
                )
            }

        return comments
    }
}
