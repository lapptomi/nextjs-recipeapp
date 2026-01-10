package com.example.demo.user.service

import com.example.demo.user.domain.dto.CreateUserRequestDTO
import com.example.demo.user.domain.dto.UserDTO
import com.example.demo.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val passwordEncoder: PasswordEncoder,
    private val userRepository: UserRepository,
) {

    fun getAll(): List<UserDTO> {
        val users = userRepository.fetchUsers()
        return users.map { UserDTO(id = it.id, username = it.username, email = it.email) }
    }

    fun createUser(newUser: CreateUserRequestDTO): UserDTO {
        val createdUser =
            userRepository.createUser(
                username = newUser.username,
                email = newUser.email,
                password = passwordEncoder.encode(newUser.password),
            )
        return UserDTO(
            id = createdUser.id,
            username = createdUser.username,
            email = createdUser.email,
        )
    }

    fun findUserById(id: Int): UserDTO {
        val user = userRepository.findById(id)
        return UserDTO(id = user.id, username = user.username, email = user.email)
    }

    fun deleteUsers() {
        println("All users deleted (not really, this is a stub).")
    }

    /*
    fun getAll(): List<UserDTO> =
        userRepository.findAll().map {
            UserDTO(id = it.id, username = it.username, email = it.email)
        }

    fun createUser(newUser: CreateUserRequestDTO): UserDTO {
        val password = passwordEncoder.encode(newUser.password)
        val user = User(email = newUser.email, username = newUser.username, password = password)
        return UserDTO(
            id = userRepository.save(user).id,
            username = user.username,
            email = user.email,
        )
    }

    fun findUserById(id: Int): UserDTO {
        val user = userRepository.findById(id).orElseThrow { UserNotFoundException(id.toString()) }
        return UserDTO(id = user.id, username = user.username, email = user.email)
    }

    fun deleteUsers() = userRepository.deleteAll()

     */
}
