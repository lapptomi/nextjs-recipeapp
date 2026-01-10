package com.example.demo.user.repository

import com.example.demo.config.UserNotFoundException
import com.example.demo.user.domain.UserV2
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.stereotype.Repository

@Repository
class UserRepository(val jdbcTemplate: NamedParameterJdbcTemplate) {
    fun fetchUsers(): List<UserV2> {
        val sql = "SELECT id, username, email, password, created_at FROM users"
        val users =
            jdbcTemplate.query(sql) { rs, _ ->
                UserV2(
                    id = rs.getInt("id"),
                    username = rs.getString("username"),
                    email = rs.getString("email"),
                    password = rs.getString("password"),
                    createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                )
            }

        println("USERS FETCHED: $users")
        return users
    }

    fun findByEmail(email: String): UserV2 {
        val sql = "SELECT id, username, email, password, created_at FROM users WHERE email = :email"
        val params = MapSqlParameterSource().addValue("email", email)

        val user =
            jdbcTemplate
                .query(sql, params) { rs, _ ->
                    UserV2(
                        id = rs.getInt("id"),
                        username = rs.getString("username"),
                        email = rs.getString("email"),
                        password = rs.getString("password"),
                        createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                    )
                }
                .firstOrNull()

        println("USER FOUND: $user")

        return user ?: throw UserNotFoundException("User with email $email not found")
    }

    fun findById(id: Int): UserV2 {
        val sql = "SELECT id, username, email, password, created_at FROM users WHERE id = :id"
        val params = MapSqlParameterSource().addValue("id", id)

        val user =
            jdbcTemplate
                .query(sql, params) { rs, _ ->
                    UserV2(
                        id = rs.getInt("id"),
                        username = rs.getString("username"),
                        email = rs.getString("email"),
                        password = rs.getString("password"),
                        createdAt = rs.getTimestamp("created_at").toLocalDateTime(),
                    )
                }
                .firstOrNull()

        println("USERS FOUND: $user")

        return user ?: throw UserNotFoundException("User with id $id not found")
    }

    fun createUser(username: String, email: String, password: String): UserV2 {
        val sql =
            "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)"
        val params =
            MapSqlParameterSource()
                .addValue("username", username)
                .addValue("email", email)
                .addValue("password", password)

        val keyHolder = GeneratedKeyHolder()
        jdbcTemplate.update(sql, params, keyHolder, arrayOf("id"))
        val id = keyHolder.key?.toInt() ?: 0
        println("ID OF CREATED USER: $id")
        return UserV2(id = id, username = username, email = email, password = password)
    }
}
