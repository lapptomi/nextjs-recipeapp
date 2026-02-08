package com.example.demo.auth.service

import com.example.demo.auth.domain.JwtTokenDto
import com.example.demo.auth.domain.SocialLoginRequestDTO
import com.example.demo.config.SecurityConfig
import com.example.demo.user.repository.UserRepository
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
            userId = user.id,
        )
    }

    fun socialLogin(credentials: SocialLoginRequestDTO): JwtTokenDto {
        val user =
            userRepository.findByProviderId(credentials.providerId)
                ?: userRepository.createSocialUser(
                    username = credentials.name,
                    email = credentials.email,
                    provider = credentials.provider,
                    providerId = credentials.providerId,
                    image = credentials.image,
                )

        return JwtTokenDto(
            token = jwtService.generateToken(user.email),
            email = user.email,
            username = user.username,
            userId = user.id,
        )
    }
}
