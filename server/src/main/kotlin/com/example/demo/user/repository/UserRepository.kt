package com.example.demo.user.repository

import com.example.demo.config.UserNotFoundException
import com.example.demo.user.domain.User
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.stereotype.Repository

@Repository
class UserRepository(val jdbcTemplate: NamedParameterJdbcTemplate) {

    @Value("\${get.users}") private lateinit var getUsersQuery: String
    @Value("\${create.user}") private lateinit var createUserQuery: String

    fun fetchUsers(): List<User> {
        val users =
            jdbcTemplate.query(getUsersQuery) { rs, _ ->
                User(
                    id = rs.getInt("id"),
                    username = rs.getString("username"),
                    email = rs.getString("email"),
                    createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                    bio = null,
                    image = null,
                )
            }

        return users
    }

    fun findByEmail(email: String): User {
        val params = MapSqlParameterSource().addValue("email", email)
        val sql = "SELECT id, username, email, image, password, bio, created_at FROM users WHERE email = :email"

        val user =
            jdbcTemplate
                .query(sql, params) { rs, _ ->
                    User(
                        id = rs.getInt("id"),
                        username = rs.getString("username"),
                        email = rs.getString("email"),
                        createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                        password = rs.getString("password"),
                        bio = rs.getString("bio"),
                        image = rs.getString("image"),
                    )
                }
                .firstOrNull()

        return user ?: throw UserNotFoundException("User with email $email not found")
    }

    fun findUserById(id: Int): User {
        val params = MapSqlParameterSource().addValue("id", id)
        val sql = "SELECT id, username, email, image, created_at, bio FROM users WHERE id = :id"
        val user =
            jdbcTemplate
                .query(sql, params) { rs, _ ->
                    User(
                        id = rs.getInt("id"),
                        username = rs.getString("username"),
                        email = rs.getString("email"),
                        createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                        password = null,
                        bio = rs.getString("bio"),
                        image = rs.getString("image"),
                    )
                }
                .firstOrNull()

        return user ?: throw UserNotFoundException(id = id.toString())
    }

    fun createUser(username: String, email: String, password: String): User {
        val params =
            MapSqlParameterSource()
                .addValue("username", username)
                .addValue("email", email)
                .addValue("password", password)
                .addValue("provider", "credentials")

        val keyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(createUserQuery, params, keyHolder, arrayOf("id"))
        val id =
            keyHolder.keys?.get("id")?.toString()?.toInt()
                ?: keyHolder.key?.toInt()
                ?: throw IllegalStateException("Failed to retrieve generated id")

        return User(id = id, username = username, email = email, bio = null, image = null)
    }

    fun createSocialUser(username: String, email: String, providerId: String, provider: String, image: String?): User {
        val params =
            MapSqlParameterSource()
                .addValue("username", username)
                .addValue("email", email)
                .addValue("provider_id", providerId)
                .addValue("provider", provider)
                .addValue("image", image)

        val sql =
            """
            INSERT INTO users (username, email, provider_id, provider, image)
            VALUES (:username, :email, :provider_id, :provider, :image)
            """

        val keyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(sql, params, keyHolder, arrayOf("id"))
        val id =
            keyHolder.keys?.get("id")?.toString()?.toInt()
                ?: keyHolder.key?.toInt()
                ?: throw IllegalStateException("Failed to retrieve generated id")

        return User(id = id, username = username, email = email, bio = null, image = image)
    }

    fun findByProviderId(providerId: String): User? {
        val sql = "SELECT * FROM users WHERE provider_id = :providerId"
        val params = MapSqlParameterSource().addValue("providerId", providerId)

        return jdbcTemplate
            .query(sql, params) { rs, _ ->
                User(
                    id = rs.getInt("id"),
                    username = rs.getString("username"),
                    email = rs.getString("email"),
                    createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                    bio = rs.getString("bio"),
                    image = rs.getString("image"),
                )
            }
            .firstOrNull()
    }

    fun deleteById(id: Int) {
        val sql = "DELETE FROM users WHERE id = :id"
        val params = MapSqlParameterSource().addValue("id", id)
        jdbcTemplate.update(sql, params)
    }

    fun deleteAll() {
        val sql = "DELETE FROM users"
        jdbcTemplate.update(sql, MapSqlParameterSource())
    }

    fun updateUser(userId: Int, username: String?, email: String?) {
        val fieldsToUpdate = mutableListOf<String>()
        if (username != null) fieldsToUpdate.add("username = :username")
        if (email != null) fieldsToUpdate.add("email = :email")
        if (fieldsToUpdate.isEmpty()) throw IllegalArgumentException("No fields provided to update")

        val params =
            MapSqlParameterSource().addValue("userId", userId).addValue("username", username).addValue("email", email)

        val sql =
            """
            UPDATE users
            SET ${fieldsToUpdate.joinToString(", ")}
            WHERE id = :userId
        """

        jdbcTemplate.update(sql, params)
    }

    fun addFollower(followerId: Int, userToFollowId: Int) {
        val sql = "INSERT INTO user_followers (follower_id, user_id) VALUES (:followerId, :followedUserId)"
        val params =
            MapSqlParameterSource().addValue("followerId", followerId).addValue("followedUserId", userToFollowId)
        jdbcTemplate.update(sql, params)
    }

    fun getUserFollowers(userId: Int): List<User> {
        val sql =
            """
            SELECT u.id, u.username, u.email, u.password, u.created_at, u.image
            FROM users u
            JOIN user_followers uf ON u.id = uf.follower_id
            WHERE uf.user_id = :userId
        """
        val params = MapSqlParameterSource().addValue("userId", userId)

        return jdbcTemplate.query(sql, params) { rs, _ ->
            User(
                id = rs.getInt("id"),
                username = rs.getString("username"),
                email = rs.getString("email"),
                createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                bio = null,
                image = rs.getString("image"),
            )
        }
    }

    fun getUserFollowing(userId: Int): List<User> {
        val sql =
            """
            SELECT u.id, u.username, u.email, u.password, u.created_at
            FROM users u
            JOIN user_followers uf ON u.id = uf.user_id
            WHERE uf.follower_id = :userId
        """
        val params = MapSqlParameterSource().addValue("userId", userId)

        return jdbcTemplate.query(sql, params) { rs, _ ->
            User(
                id = rs.getInt("id"),
                username = rs.getString("username"),
                email = rs.getString("email"),
                // password = rs.getString("password"),
                createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                bio = null,
                image = null,
            )
        }
    }

    fun removeFollower(followerId: Int, userToUnfollowId: Int) {
        val sql = "DELETE FROM user_followers WHERE follower_id = :followerId AND user_id = :user_id"
        val params = MapSqlParameterSource().addValue("followerId", followerId).addValue("user_id", userToUnfollowId)
        jdbcTemplate.update(sql, params)
    }
}
