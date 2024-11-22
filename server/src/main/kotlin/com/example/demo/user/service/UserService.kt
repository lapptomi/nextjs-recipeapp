package com.example.demo.user.service

import com.example.demo.config.SecurityConfig
import com.example.demo.user.domain.dto.CreateUserDTO
import com.example.demo.user.domain.User
import com.example.demo.user.domain.dto.UserDTO
import com.example.demo.user.domain.toDTO
import com.example.demo.user.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val securityConfig: SecurityConfig
) {
    fun getUsers(): List<UserDTO> = userRepository
        .findAll()
        .map { it.toDTO() }

    fun createUser(newUser: CreateUserDTO): UserDTO = userRepository
        .save(User(email = newUser.email, username = newUser.username, password = securityConfig.passwordEncoder().encode(newUser.password)))
        .toDTO()

    fun findUserById(id: Int): UserDTO = userRepository
        .findById(id)
        .orElseThrow { throw NoSuchElementException("User with id $id not found") }
        .toDTO()

    fun deleteUsers() = userRepository.deleteAll()
}