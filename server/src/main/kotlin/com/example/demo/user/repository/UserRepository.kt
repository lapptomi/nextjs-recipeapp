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
    @Value("\${find.user.by.user_email}") private lateinit var findUserByEmailQuery: String
    @Value("\${find.user.by.user_id}") private lateinit var findUserByUserIdQuery: String
    @Value("\${create.user}") private lateinit var createUserQuery: String

    fun fetchUsers(): List<User> {
        val users =
            jdbcTemplate.query(getUsersQuery) { rs, _ ->
                User(
                    id = rs.getInt("id"),
                    username = rs.getString("username"),
                    email = rs.getString("email"),
                    password = rs.getString("password"),
                    createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                )
            }

        return users
    }

    fun findByEmail(email: String): User {
        val params = MapSqlParameterSource().addValue("email", email)

        val user =
            jdbcTemplate
                .query(findUserByEmailQuery, params) { rs, _ ->
                    User(
                        id = rs.getInt("id"),
                        username = rs.getString("username"),
                        email = rs.getString("email"),
                        password = rs.getString("password"),
                        createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                    )
                }
                .firstOrNull()

        return user ?: throw UserNotFoundException("User with email $email not found")
    }

    fun findById(id: Int): User {
        val params = MapSqlParameterSource().addValue("id", id)

        val user =
            jdbcTemplate
                .query(findUserByUserIdQuery, params) { rs, _ ->
                    User(
                        id = rs.getInt("id"),
                        username = rs.getString("username"),
                        email = rs.getString("email"),
                        password = rs.getString("password"),
                        createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
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

        val keyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(createUserQuery, params, keyHolder, arrayOf("id"))
        val id =
            keyHolder.keys?.get("id")?.toString()?.toInt()
                ?: keyHolder.key?.toInt()
                ?: throw IllegalStateException("Failed to retrieve generated id")

        return User(id = id, username = username, email = email, password = password)
    }

    fun createSocialUser(username: String, email: String, providerId: String): User {
        val params =
            MapSqlParameterSource()
                .addValue("username", username)
                .addValue("email", email)
                .addValue("provider_id", providerId)

        val sql =
            """
            INSERT INTO users (username, email, provider_id)
            VALUES (:username, :email, :provider_id)
        """
                .trimIndent()

        val keyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(sql, params, keyHolder, arrayOf("id"))
        val id =
            keyHolder.keys?.get("id")?.toString()?.toInt()
                ?: keyHolder.key?.toInt()
                ?: throw IllegalStateException("Failed to retrieve generated id")

        return User(id = id, username = username, email = email, password = "")
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
                    password = null,
                    createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                )
            }
            .firstOrNull()
    }

    fun deleteAll() {
        val sql = "DELETE FROM users"
        jdbcTemplate.update(sql, MapSqlParameterSource())
    }
}
