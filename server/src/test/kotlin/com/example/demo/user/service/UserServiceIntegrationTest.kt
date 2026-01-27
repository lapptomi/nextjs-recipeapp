package com.example.demo.user.service

import com.example.demo.TextFixtures.users
import com.example.demo.config.UserNotFoundException
import com.example.demo.user.domain.CreateUserRequestDTO
import com.example.demo.user.domain.User
import com.example.demo.user.repository.UserRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext

@SpringBootTest
@DirtiesContext
class UserServiceIntegrationTest {

    @Autowired private lateinit var userService: UserService
    @Autowired private lateinit var userRepository: UserRepository

    private lateinit var testUser: User
    private lateinit var testUser2: User

    @BeforeEach
    fun setup() {
        val user1 =
            userRepository.createUser(
                username = users[0].username,
                email = users[0].email,
                password = "password1",
            )
        val user2 =
            userRepository.createUser(
                username = users[1].username,
                email = users[1].email,
                password = "password2",
            )
        testUser = user1
        testUser2 = user2
    }

    @AfterEach
    fun teardown() {
        userRepository.deleteAll()
    }

    @Test
    fun `getAll returns all users as DTOs`() {
        val result = userService.getAll()

        assertEquals(users.size, result.size)
        assertEquals(testUser.username, result[0].username)
        assertEquals(testUser2.username, result[1].username)
    }

    @Test
    fun `createUser saves a new user`() {
        assertEquals(users.size, userService.getAll().size)
        val newUser = CreateUserRequestDTO("email3", "user3", "password3")
        val createdUser = userService.createUser(newUser)

        assertEquals(newUser.username, createdUser.username)
        assertEquals(newUser.email, createdUser.email)
        assertEquals(users.size + 1, userService.getAll().size)
    }

    @Test
    fun `findUserById returns the correct user`() {
        val user = userService.findUserById(testUser.id)
        assertEquals(testUser.username, user.username)
        assertEquals(testUser.email, user.email)
    }

    @Test
    fun `findUserById throws UserNotFoundException when user does not exist`() {
        val users = userService.getAll()
        val userIds = users.map { it.id }.plus(users.size + 1).plus(users.size + 2)
        userIds.forEach {
            try {
                val user = userService.findUserById(it)
                assertEquals(it, user.id)
            } catch (e: UserNotFoundException) {
                assertEquals("User with id ${it} not found", e.message)
            }
        }
    }

    @Test
    fun `deleteUsers removes all users`() {
        assertEquals(users.size, userService.getAll().size)
        userService.deleteUsers()
        assertEquals(0, userService.getAll().size)
    }
}
