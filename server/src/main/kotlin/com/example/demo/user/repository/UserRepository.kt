package com.example.demo.user.repository

import com.example.demo.config.UserNotFoundException
import com.example.demo.user.domain.User
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.stereotype.Repository

@Repository
class UserRepository(val jdbcTemplate: NamedParameterJdbcTemplate) {
    fun fetchUsers(): List<User> {
        val sql = "SELECT id, username, email, password, created_at FROM users"
        val users =
            jdbcTemplate.query(sql) { rs, _ ->
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
        val sql = "SELECT id, username, email, password, created_at FROM users WHERE email = :email"
        val params = MapSqlParameterSource().addValue("email", email)

        val user =
            jdbcTemplate
                .query(sql, params) { rs, _ ->
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
        val sql = "SELECT id, username, email, password, created_at FROM users WHERE id = :id"
        val params = MapSqlParameterSource().addValue("id", id)

        val user =
            jdbcTemplate
                .query(sql, params) { rs, _ ->
                    User(
                        id = rs.getInt("id"),
                        username = rs.getString("username"),
                        email = rs.getString("email"),
                        password = rs.getString("password"),
                        createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                    )
                }
                .firstOrNull()

        return user ?: throw UserNotFoundException("User with id $id not found")
    }

    fun createUser(username: String, email: String, password: String): User {
        val sql =
            "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)"
        val params =
            MapSqlParameterSource()
                .addValue("username", username)
                .addValue("email", email)
                .addValue("password", password)

        val keyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(sql, params, keyHolder, arrayOf("id"))
        val id =
            keyHolder.keys?.get("id")?.toString()?.toInt()
                ?: keyHolder.key?.toInt()
                ?: throw IllegalStateException("Failed to retrieve generated id")

        return User(id = id, username = username, email = email, password = password)
    }

    fun deleteAll() {
        val sql = "DELETE FROM users"
        jdbcTemplate.update(sql, MapSqlParameterSource())
    }
}
