package com.example.demo.user

import com.example.demo.ApiPath
import com.example.demo.TextFixtures.users
import com.example.demo.config.UserNotFoundException
import com.example.demo.user.domain.User
import com.example.demo.user.domain.dto.CreateUserRequestDTO
import com.example.demo.user.domain.dto.UserDTO
import com.example.demo.user.mapper.UserMapper
import com.example.demo.user.service.UserService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.doNothing
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired private lateinit var mockMvc: MockMvc

    @MockBean private lateinit var userService: UserService

    @Autowired private lateinit var objectMapper: ObjectMapper

    @Autowired private lateinit var userMapper: UserMapper

    private lateinit var testUser: User

    @BeforeEach
    fun setUp() {
        testUser = users[0]
    }

    @Test
    fun `getUserById should return user when user exists`() {
        val userId = 1
        `when`(userService.findUserById(userId)).thenReturn(userMapper.toDTO(testUser))

        mockMvc
            .perform(
                get(ApiPath.USERS_API + "/{id}", userId).contentType(MediaType.APPLICATION_JSON)
            )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(testUser.id))
            .andExpect(jsonPath("$.ussername").value(testUser.username))
            .andExpect(jsonPath("$.email").value(testUser.email))
            .andExpect(jsonPath("$.password").doesNotExist())
            .andExpect(jsonPath("$.recipes").exists())
    }

    @Test
    fun `getUserById should return 404 when user does not exist`() {
        val userId = 9999
        `when`(userService.findUserById(userId)).thenThrow(UserNotFoundException(userId.toString()))

        mockMvc
            .perform(
                get(ApiPath.USERS_API + "/{id}", userId).contentType(MediaType.APPLICATION_JSON)
            )
            .andExpect(status().isNotFound)
            .andExpect(jsonPath("$.message").value("User with id $userId not found"))
    }

    @Test
    fun `createUser should return created user`() {
        val id = 12
        val newUser =
            CreateUserRequestDTO(
                username = testUser.username,
                email = testUser.email,
                password = testUser.password,
            )
        val userDTO = UserDTO(id = id, username = newUser.username, email = newUser.email)

        `when`(userService.createUser(newUser)).thenReturn(userDTO)
        mockMvc
            .perform(
                post(ApiPath.USERS_API)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newUser))
            )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.username").value(newUser.username))
            .andExpect(jsonPath("$.email").value(newUser.email))
            .andExpect(jsonPath("$.password").doesNotExist())
            .andExpect(jsonPath("$.recipes").exists())
    }

    @Test
    fun `deleteUser should return 204 when user is deleted`() {
        `when`(userService.getAll()).thenReturn(users.map { userMapper.toDTO(it) })
        mockMvc
            .perform(get(ApiPath.USERS_API).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(users.size))

        doNothing().`when`(userService).deleteUsers()
        mockMvc
            .perform(delete(ApiPath.USERS_API).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent)

        `when`(userService.getAll()).thenReturn(emptyList())
        mockMvc
            .perform(get(ApiPath.USERS_API).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(0))
    }
}
