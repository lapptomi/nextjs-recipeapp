package com.example.demo.user.service

import com.example.demo.config.SecurityConfig
import com.example.demo.user.domain.NewUserDTO
import com.example.demo.user.domain.User
import com.example.demo.user.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val securityConfig: SecurityConfig
) {
    fun getUsers(): MutableIterable<User> = userRepository.findAll()

    fun createUser(user: NewUserDTO): User = userRepository.save(
        User(
            username = user.username,
            email = user.email,
            password = securityConfig.passwordEncoder().encode(user.password)
        )
    )

    fun findUserById(id: Int): User = userRepository.findById(id).orElseThrow()

    fun findUserByEmail(email: String): User = userRepository.findByEmail(email)

    fun deleteUsers() = userRepository.deleteAll()
}