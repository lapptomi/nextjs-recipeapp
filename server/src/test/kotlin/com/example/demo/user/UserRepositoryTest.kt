package com.example.demo.user

import com.example.demo.user.domain.User
import com.example.demo.user.repository.UserRepository
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import kotlin.test.Test


@DataJpaTest(
    properties = [
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.jpa.hibernate.ddl-auto=create-drop"
    ]
)
class UserRepositoryTest {

    @Autowired
    lateinit var userRepository: UserRepository

    val users = listOf(
        User(username = "testuser", email = "testemail", password = "password"),
        User(username = "testuser2", email = "testemail2", password = "password2")
    )

    @BeforeEach
    fun setUp() {
        userRepository.saveAll(users)
    }

    @AfterEach
    fun tearDown() {
        userRepository.deleteAll()
    }

    @Test
    fun `should return all users`() {
        val retrievedUsers = userRepository.findAll()
        assert(retrievedUsers.toList().size == 2)
    }

    @Test
    fun `should return user by email`() {
        val retrievedUser = userRepository.findByEmail(users[0].email)
        assert(retrievedUser.username == users[0].username)
    }

    @Test
    fun `should create a new user`() {
        val newUser = User(username = "test3", email = "email3", password = "password3")
        assert(userRepository.findAll().toList().size == users.size)
        val user = userRepository.save(newUser)
        assert(userRepository.findAll().toList().size == users.size + 1)
        assert(user.username == newUser.username)
    }
}