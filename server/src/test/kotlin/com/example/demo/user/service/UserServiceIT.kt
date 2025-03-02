package com.example.demo.user.service

import com.example.demo.config.SecurityConfig
import com.example.demo.user.domain.dto.CreateUserDTO
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.TestInstance.Lifecycle.PER_CLASS
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import kotlin.test.Test
import kotlin.test.assertEquals

@SpringBootTest
@ExtendWith(SpringExtension::class)
@TestInstance(PER_CLASS)
class UserServiceIT {

    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var securityConfig: SecurityConfig

    private val users = listOf(
        CreateUserDTO(username = "user1", email="test@test.com", password = "password1"),
        CreateUserDTO(username = "user2", email="test2@test.com", password = "password2"),
        CreateUserDTO(username = "user3", email="test3@test.com", password = "password3")
    )

    @BeforeAll
    fun setup() {
        userService.createUser(users[0])
        userService.createUser(users[1])
    }

    @AfterAll
    fun tearDown() {
        userService.deleteUsers()
    }

    @Test
    fun `should return user by id`() {
        val userId = 1
        val user = userService.findUserById(userId)
        assertEquals(userId, user.id)
    }

    @Test
    fun `should return list of users`() {
        val users = userService.getUsers()
        assertEquals(3, users.size)
    }

    @Test
    fun `should create user with valid fields`() {
        val user = users[2]
        val createdUser = userService.createUser(user)
        assertEquals(user.username, createdUser.username)
    }

    @Test
    fun `should not create user with duplicate email`() {
        val usersSize = userService.getUsers().size
        val userWithDuplicateEmail = CreateUserDTO(
            username = "user4",
            email=users[0].email,
            password = "password4"
        )
        assertThrows<Exception> { userService.createUser(userWithDuplicateEmail) }
        assertEquals(usersSize, userService.getUsers().size)
    }

    @Test
    fun `should not create user with duplicate username`() {
        val usersSize = userService.getUsers().size
        val userWithDuplicateEmail = CreateUserDTO(
            username = users[0].username,
            email = users[2].email,
            password = users[2].password
        )
        assertThrows<Exception> { userService.createUser(userWithDuplicateEmail) }
        assertEquals(usersSize, userService.getUsers().size)
    }

    @Test
    fun `should not create user with too long username`() {
        val usersSize = userService.getUsers().size
        val userWithTooLongUsername = CreateUserDTO(username = "a".repeat(31), email = users[2].email, password = users[2].password)
        val error = assertThrows<Exception> { userService.createUser(userWithTooLongUsername) }
        assertEquals(usersSize, userService.getUsers().size)
        assertEquals("could not execute statement [Value too long for column \"USERNAME CHARACTER VARYING(30)\": \"'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' (31)\"; SQL statement:\n" + "insert into users (created_at,email,password,username,id) values (?,?,?,?,?) [22001-224]] [insert into users (created_at,email,password,username,id) values (?,?,?,?,?)]; SQL [insert into users (created_at,email,password,username,id) values (?,?,?,?,?)]", error.message)
    }

    @Test
    fun `should not create user with too long email`() {
        val usersSize = userService.getUsers().size
        val userWithTooLongEmail = CreateUserDTO(username = users[2].username, email = "a".repeat(101), password = users[2].password)
        val error = assertThrows<Exception> { userService.createUser(userWithTooLongEmail) }
        assertEquals(usersSize, userService.getUsers().size)
        assertEquals("could not execute statement [Value too long for column \"EMAIL CHARACTER VARYING(100)\": \"'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa... (101)\"; SQL statement:\n" +
                "insert into users (created_at,email,password,username,id) values (?,?,?,?,?) [22001-224]] [insert into users (created_at,email,password,username,id) values (?,?,?,?,?)]; SQL [insert into users (created_at,email,password,username,id) values (?,?,?,?,?)]", error.message)
    }
}