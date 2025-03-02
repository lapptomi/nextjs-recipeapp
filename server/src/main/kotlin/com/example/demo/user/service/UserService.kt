package com.example.demo.user.service

import com.example.demo.config.SecurityConfig
import com.example.demo.user.domain.dto.CreateUserDTO
import com.example.demo.user.domain.User
import com.example.demo.user.domain.dto.UserDTO
import com.example.demo.user.mapper.UserMapper
import com.example.demo.user.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val securityConfig: SecurityConfig,
    private val userMapper: UserMapper
) {
    fun getUsers(): List<UserDTO> = userRepository
        .findAll()
        .map { userMapper.toDTO(it) }

    fun createUser(newUser: CreateUserDTO): UserDTO {
        val user = userRepository.save(User(email = newUser.email, username = newUser.username, password = securityConfig.passwordEncoder().encode(newUser.password)))
        return userMapper.toDTO(user)
    }
    fun findUserById(id: Int): UserDTO {
        val user = userRepository
            .findById(id)
            .orElseThrow { throw NoSuchElementException("User with id $id not found") }
        return userMapper.toDTO(user)
    }

    fun deleteUsers() = userRepository.deleteAll()
}