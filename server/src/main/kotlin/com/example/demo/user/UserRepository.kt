package com.example.demo.user

import com.example.demo.config.UserNotFoundException
import com.example.demo.user.domain.User
import com.example.demo.user.domain.UserWithPassword
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.DataClassRowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.stereotype.Repository

@Repository
class UserRepository(val jdbcTemplate: NamedParameterJdbcTemplate) {
    fun fetchUsers(): List<User> {
        return jdbcTemplate.query(
            "SELECT id, username, email, image, bio, created_at FROM users",
            DataClassRowMapper(User::class.java),
        )
    }

    fun findByEmail(email: String): UserWithPassword {
        val params = MapSqlParameterSource().addValue("email", email)
        val user =
            jdbcTemplate.queryForObject(
                "SELECT id, username, email, image, password, bio, created_at FROM users WHERE email = :email",
                params,
                DataClassRowMapper(UserWithPassword::class.java),
            )

        return user ?: throw UserNotFoundException("User with email $email not found")
    }

    fun findUserByIdOrNull(id: Int): User? {
        val params = MapSqlParameterSource().addValue("id", id)
        return try {
            jdbcTemplate.queryForObject(
                "SELECT id, username, email, image, created_at, bio FROM users WHERE id = :id",
                params,
                DataClassRowMapper(User::class.java),
            )
        } catch (e: EmptyResultDataAccessException) {
            throw UserNotFoundException(id.toString())
        }
    }

    fun createUser(username: String, email: String, password: String): User {
        val params =
            MapSqlParameterSource()
                .addValue("username", username)
                .addValue("email", email)
                .addValue("password", password)
                .addValue("provider", "credentials")

        val keyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(
            "INSERT INTO users (username, email, password, provider) VALUES (:username, :email, :password, :provider)",
            params,
            keyHolder,
            arrayOf("id"),
        )

        val id = keyHolder.key?.toInt() ?: throw IllegalStateException("Failed to retrieve id after user insert")

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

        val keyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(
            "INSERT INTO users (username, email, provider_id, provider, image) VALUES (:username, :email, :provider_id, :provider, :image)",
            params,
            keyHolder,
            arrayOf("id"),
        )
        val id = keyHolder.key?.toInt() ?: throw IllegalStateException("Failed to retrieve id after user insert")

        return User(id = id, username = username, email = email, bio = null, image = image)
    }

    fun findByProviderId(providerId: String): User? {
        val params = MapSqlParameterSource().addValue("providerId", providerId)
        return try {
            jdbcTemplate.queryForObject(
                "SELECT id, username, email, image, bio, created_at FROM users WHERE provider_id = :providerId",
                params,
                DataClassRowMapper(User::class.java),
            )
        } catch (e: EmptyResultDataAccessException) {
            throw UserNotFoundException(providerId)
        }
    }

    fun deleteById(id: Int) {
        val params = MapSqlParameterSource().addValue("id", id)
        jdbcTemplate.update("DELETE FROM users WHERE id = :id", params)
    }

    fun deleteAll() {
        jdbcTemplate.update("DELETE FROM users", MapSqlParameterSource())
    }

    fun updateUser(userId: Int, username: String?, email: String?) {
        val fieldsToUpdate = mutableListOf<String>()
        if (username != null) fieldsToUpdate.add("username = :username")
        if (email != null) fieldsToUpdate.add("email = :email")
        if (fieldsToUpdate.isEmpty()) throw IllegalArgumentException("No fields provided to update")

        val params =
            MapSqlParameterSource().addValue("userId", userId).addValue("username", username).addValue("email", email)

        jdbcTemplate.update("UPDATE users SET ${fieldsToUpdate.joinToString(", ")} WHERE id = :userId", params)
    }

    fun addFollower(followerId: Int, userToFollowId: Int) {
        val params =
            MapSqlParameterSource().addValue("followerId", followerId).addValue("followedUserId", userToFollowId)
        jdbcTemplate.update(
            "INSERT INTO user_followers (follower_id, user_id) VALUES (:followerId, :followedUserId)",
            params,
        )
    }

    fun getUserFollowers(userId: Int): List<User> {
        val sql =
            """
            SELECT u.id, u.username, u.email, u.created_at, u.image, u.bio
            FROM users u
            JOIN user_followers uf ON u.id = uf.follower_id
            WHERE uf.user_id = :userId
        """
        val params = MapSqlParameterSource().addValue("userId", userId)
        return jdbcTemplate.query(sql, params, DataClassRowMapper(User::class.java))
    }

    fun getUserFollowing(userId: Int): List<User> {
        val sql =
            """
            SELECT u.id, u.username, u.email, u.created_at, u.image, u.bio
            FROM users u
            JOIN user_followers uf ON u.id = uf.user_id
            WHERE uf.follower_id = :userId
        """
        val params = MapSqlParameterSource().addValue("userId", userId)
        return jdbcTemplate.query(sql, params, DataClassRowMapper(User::class.java))
    }

    fun removeFollower(followerId: Int, userToUnfollowId: Int) {
        val params = MapSqlParameterSource().addValue("followerId", followerId).addValue("user_id", userToUnfollowId)
        jdbcTemplate.update("DELETE FROM user_followers WHERE follower_id = :followerId AND user_id = :user_id", params)
    }
}
