package com.example.demo.auth.service

import com.example.demo.auth.domain.JwtTokenDto
import com.example.demo.config.SecurityConfig
import com.example.demo.user.repository.UserRepository
import com.example.demo.user.service.UserService
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val jwtService: JwtService,
    private val securityConfig: SecurityConfig,
    private val userRepository: UserRepository,
) {
    fun login(email: String, password: String): JwtTokenDto {
        val user = userRepository.findByEmail(email)

        if (user.email != email || !securityConfig.passwordEncoder().matches(password, user.password)) {
            throw BadCredentialsException("Invalid credentials")
        }
        return JwtTokenDto(
            token = jwtService.generateToken(user.email),
            email = user.email,
            username = user.username,
            userId = user.id
        )
    }
}