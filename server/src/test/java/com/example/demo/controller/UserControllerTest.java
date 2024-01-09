package com.example.demo.controller;

import com.example.demo.controllers.UserController;
import com.example.demo.dto.NewUserDTO;
import com.example.demo.mapper.UserMapper;
import com.example.demo.models.User;
import com.example.demo.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    private List<User> mockUserList;

    @BeforeEach
    public void setUp() {
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("testemail@test.com");
        user1.setUsername("testusername");
        user1.setPassword("testpassword");

        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("testemail2@test.com");
        user2.setUsername("testusername2");
        user2.setPassword("testpassword2");

        mockUserList = Arrays.asList(user1, user2);
    }

    @Test
    public void testGetAllUsers() throws Exception {
        when(userService.getAllUsers()).thenReturn(mockUserList);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(mockUserList.get(0).getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].email").value(mockUserList.get(0).getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].username").value(mockUserList.get(0).getUsername()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].password").value(mockUserList.get(0).getPassword()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(mockUserList.get(1).getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].email").value(mockUserList.get(1).getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].username").value(mockUserList.get(1).getUsername()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].password").value(mockUserList.get(1).getPassword()));
    }


    @Test
    public void testGetUserById() throws Exception {
        when(userService.getUserById(1L)).thenReturn(mockUserList.get(0));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(mockUserList.get(0).getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(mockUserList.get(0).getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value(mockUserList.get(0).getUsername()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.password").value(mockUserList.get(0).getPassword()));
    }

    @Test
    public void testCreateUser() throws Exception {
        NewUserDTO newUserDTO = new NewUserDTO();
        newUserDTO.setUsername(mockUserList.get(0).getUsername());
        newUserDTO.setEmail(mockUserList.get(0).getEmail());
        newUserDTO.setPassword(mockUserList.get(0).getPassword());

        User createdUser = UserMapper.INSTANCE.toEntity(newUserDTO);

        when(userService.create(any(NewUserDTO.class))).thenReturn(createdUser);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"New User\"}"))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(createdUser.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value(createdUser.getUsername()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(createdUser.getEmail()));
    }
}