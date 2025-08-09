package com.example.demo.user

import com.example.demo.TextFixtures.users
import com.example.demo.user.domain.User
import com.example.demo.user.repository.UserRepository
import com.example.demo.user.service.UserService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired private lateinit var mockMvc: MockMvc
    @Autowired private lateinit var userService: UserService
    @Autowired private lateinit var userRepository: UserRepository
    @Autowired private lateinit var objectMapper: ObjectMapper

    private lateinit var testUser: User

    @BeforeEach
    fun setUp() {
        val user = userRepository.save(users[0])
        testUser = user
    }

    @AfterEach
    fun teardown() {
        userRepository.deleteAll()
    }

    /*
    TODO: Fix these tests later
    @Test
    fun `getUserById should return user when user exists`() {
        mockMvc
            .perform(
                get(ApiPath.USERS_API + "/{id}", testUser.id)
                    .contentType(MediaType.APPLICATION_JSON)
            )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(testUser.id))
            .andExpect(jsonPath("$.username").value(testUser.username))
            .andExpect(jsonPath("$.email").value(testUser.email))
            .andExpect(jsonPath("$.password").doesNotExist())
            .andExpect(jsonPath("$.recipes").exists())
    }

    @Test
    fun `getUserById should return 404 when user does not exist`() {
        val nonExistingId = -123
        mockMvc
            .perform(
                get(ApiPath.USERS_API + "/{id}", nonExistingId)
                    .contentType(MediaType.APPLICATION_JSON)
            )
            .andExpect(status().isNotFound)
            .andExpect(jsonPath("$.message").value("User with id $nonExistingId not found"))
    }

    @Test
    fun `createUser should return created user`() {
        val newUser = CreateUserRequestDTO("uniqueusername", "unique@example.com", "testpassword3")

        mockMvc
            .perform(
                post(ApiPath.USERS_API)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newUser))
            )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.username").value(newUser.username))
            .andExpect(jsonPath("$.email").value(newUser.email))
            .andExpect(jsonPath("$.password").doesNotExist())
            .andExpect(jsonPath("$.recipes").exists())
    }

    @Test
    fun `deleteUser should return 204 when user is deleted`() {
        assertTrue(userRepository.existsById(testUser.id))
        assertTrue(userService.getAll().isNotEmpty())

        mockMvc
            .perform(get(ApiPath.USERS_API).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(1))

        mockMvc
            .perform(delete(ApiPath.USERS_API).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent)

        assertTrue(userService.getAll().isEmpty())
    }
     */
}
