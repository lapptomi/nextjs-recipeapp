package com.example.demo.user.service

import com.example.demo.config.UserNotFoundException
import com.example.demo.user.domain.User
import com.example.demo.user.domain.dto.CreateUserRequestDTO
import com.example.demo.user.domain.dto.UserDTO
import com.example.demo.user.mapper.UserMapper
import com.example.demo.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val userMapper: UserMapper,
    private val passwordEncoder: PasswordEncoder,
) {
    fun getAll(): List<UserDTO> = userRepository.findAll().map { userMapper.toDTO(it) }

    fun createUser(newUser: CreateUserRequestDTO): UserDTO {
        val password = passwordEncoder.encode(newUser.password)
        val user = User(email = newUser.email, username = newUser.username, password = password)
        return userMapper.toDTO(userRepository.save(user))
    }

    fun findUserById(id: Int): UserDTO {
        val user = userRepository.findById(id).orElseThrow { UserNotFoundException(id.toString()) }
        return userMapper.toDTO(user)
    }

    fun deleteUsers() = userRepository.deleteAll()
}
