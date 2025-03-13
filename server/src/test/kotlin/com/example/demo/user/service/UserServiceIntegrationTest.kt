package com.example.demo.user.service

import com.example.demo.TextFixtures.users
import com.example.demo.config.UserNotFoundException
import com.example.demo.user.domain.User
import com.example.demo.user.domain.dto.CreateUserRequestDTO
import com.example.demo.user.repository.UserRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class UserServiceIntegrationTest {

    @Autowired private lateinit var userService: UserService
    @Autowired private lateinit var userRepository: UserRepository

    @BeforeEach
    fun setup() {
        userRepository.deleteAll()
        userRepository.saveAll<User>(users)
    }

    @Test
    fun `getAll returns all users as DTOs`() {
        val result = userService.getAll()

        assertEquals(users.size, result.size)
        assertEquals(users[0].username, result[0].username)
        assertEquals(users[1].username, result[1].username)
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
        val user = userService.findUserById(1)
        assertEquals(users[0].username, user.username)
        assertEquals(users[0].email, user.email)
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
