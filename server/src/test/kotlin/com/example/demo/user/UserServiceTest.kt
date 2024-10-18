package com.example.demo.user

import com.example.demo.config.SecurityConfig
import com.example.demo.user.domain.User
import com.example.demo.user.repository.UserRepository
import com.example.demo.user.service.UserService
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class UserServiceTest {

    @Mock
    private lateinit var userRepository: UserRepository

    @InjectMocks
    private lateinit var userService: UserService

    @Mock
    private lateinit var securityConfig: SecurityConfig

    @Test
    fun `should return all users`() {
        val user = User(username = "test", email = "Email", password = "password")
        val user2 = User(username = "test2", email = "Email", password = "password2")
        val users = listOf(user, user2)
        Mockito.`when`(userRepository.findAll()).thenReturn(users);

        val retrievedUsers = userService.getUsers();
        Assertions.assertThat(retrievedUsers).isNotNull()
            .hasSameSizeAs(users)
            .doesNotContainNull();

    }
}