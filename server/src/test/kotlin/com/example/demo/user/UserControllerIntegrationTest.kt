package com.example.demo.user

import com.example.demo.ApiPath
import com.example.demo.auth.JwtService
import com.example.demo.user.domain.CreateUserRequestDTO
import com.example.demo.user.domain.UpdateUserRequestDTO
import com.example.demo.user.domain.UserDTO
import com.fasterxml.jackson.databind.ObjectMapper
import kotlin.test.assertTrue
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired private lateinit var mockMvc: MockMvc
    @Autowired private lateinit var userService: UserService
    @Autowired private lateinit var userRepository: UserRepository
    @Autowired private lateinit var jwtService: JwtService
    @Autowired private lateinit var objectMapper: ObjectMapper

    private lateinit var testUser: UserDTO
    private lateinit var secondUser: UserDTO

    @BeforeEach
    fun setUp() {
        testUser =
            userService.createUser(
                CreateUserRequestDTO(username = "testuser", email = "hello@world.com", password = "testpassword")
            )
        secondUser =
            userService.createUser(
                CreateUserRequestDTO(username = "otheruser", email = "other@world.com", password = "testpassword")
            )
    }

    @AfterEach
    fun teardown() {
        userRepository.deleteAll()
    }

    @Test
    fun `getUserById should return user when user exists`() {
        mockMvc
            .perform(get(ApiPath.USERS_API + "/{id}", testUser.id).contentType(MediaType.APPLICATION_JSON))
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
            .perform(get(ApiPath.USERS_API + "/{id}", nonExistingId).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound)
            .andExpect(jsonPath("$.message").value("User with id $nonExistingId not found"))
    }

    @Test
    fun `createUser should return created user`() {
        val newUser = CreateUserRequestDTO("uniqueusername", "unique@example.com", "testpassword")

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
    fun `test-only deleteUsers endpoint should return 204 when users are deleted`() {
        assertTrue(userService.getAll().isNotEmpty())

        mockMvc
            .perform(get(ApiPath.USERS_API).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(2))

        mockMvc
            .perform(delete(ApiPath.USERS_API).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent)

        assertTrue(userService.getAll().isEmpty())
    }

    @Test
    fun `updateUser me should return 200 and update current user when token is valid`() {
        val updateUserRequest =
            UpdateUserRequestDTO(username = "updated-user", email = "updated@world.com", password = null)
        val token = jwtService.generateToken(testUser.id)

        mockMvc
            .perform(
                put(ApiPath.USERS_API + "/me")
                    .header("Authorization", "Bearer $token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateUserRequest))
            )
            .andExpect(status().isOk)

        mockMvc
            .perform(get(ApiPath.USERS_API + "/{id}", testUser.id).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.username").value(updateUserRequest.username))
            .andExpect(jsonPath("$.email").value(updateUserRequest.email))
    }

    @Test
    fun `updateUser me should return 401 when token is missing`() {
        val updateUserRequest =
            UpdateUserRequestDTO(username = "updated-user", email = "updated@world.com", password = null)

        mockMvc
            .perform(
                put(ApiPath.USERS_API + "/me")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateUserRequest))
            )
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.status").value(401))
            .andExpect(jsonPath("$.message").value("Invalid JWT token: missing required claims"))
    }

    @Test
    fun `deleteUser me should return 204 and delete current user when token is valid`() {
        val token = jwtService.generateToken(testUser.id)

        mockMvc
            .perform(delete(ApiPath.USERS_API + "/me").header("Authorization", "Bearer $token"))
            .andExpect(status().isNoContent)

        mockMvc
            .perform(get(ApiPath.USERS_API + "/{id}", testUser.id))
            .andExpect(status().isNotFound)
            .andExpect(jsonPath("$.message").value("User with id ${testUser.id} not found"))
    }

    @Test
    fun `deleteUser me should return 401 when token is missing`() {
        mockMvc
            .perform(delete(ApiPath.USERS_API + "/me"))
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.status").value(401))
            .andExpect(jsonPath("$.message").value("Invalid JWT token: missing required claims"))
    }

    @Test
    fun `followUser should return 200 and add follower when token is valid`() {
        val token = jwtService.generateToken(testUser.id)

        mockMvc
            .perform(post(ApiPath.USERS_API + "/follow/{id}", secondUser.id).header("Authorization", "Bearer $token"))
            .andExpect(status().isOk)

        mockMvc
            .perform(get(ApiPath.USERS_API + "/{id}/followers", secondUser.id))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].id").value(testUser.id))
    }

    @Test
    fun `followUser should return 400 when user tries to follow themselves`() {
        val token = jwtService.generateToken(testUser.id)

        mockMvc
            .perform(post(ApiPath.USERS_API + "/follow/{id}", testUser.id).header("Authorization", "Bearer $token"))
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.message").value("Users cannot follow themselves"))
    }

    @Test
    fun `followUser should return 401 when token is missing`() {
        mockMvc
            .perform(post(ApiPath.USERS_API + "/follow/{id}", secondUser.id))
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.status").value(401))
            .andExpect(jsonPath("$.message").value("Invalid JWT token: missing required claims"))
    }

    @Test
    fun `unfollowUser should return 204 and remove follower when token is valid`() {
        val token = jwtService.generateToken(testUser.id)

        mockMvc
            .perform(post(ApiPath.USERS_API + "/follow/{id}", secondUser.id).header("Authorization", "Bearer $token"))
            .andExpect(status().isOk)

        mockMvc
            .perform(
                delete(ApiPath.USERS_API + "/{id}/followers", secondUser.id).header("Authorization", "Bearer $token")
            )
            .andExpect(status().isNoContent)

        mockMvc
            .perform(get(ApiPath.USERS_API + "/{id}/followers", secondUser.id))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(0))
    }

    @Test
    fun `unfollowUser should return 401 when token is missing`() {
        mockMvc
            .perform(delete(ApiPath.USERS_API + "/{id}/followers", secondUser.id))
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.status").value(401))
            .andExpect(jsonPath("$.message").value("Invalid JWT token: missing required claims"))
    }
}
