package com.example.demo.auth.service

import com.example.demo.auth.domain.JwtTokenDto
import com.example.demo.auth.domain.SocialLoginRequestDTO
import com.example.demo.config.SecurityConfig
import com.example.demo.domain.CurrentUser
import com.example.demo.user.repository.UserRepository
import kotlin.text.toInt
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val jwtService: JwtService,
    private val securityConfig: SecurityConfig,
    private val userRepository: UserRepository,
) {

    fun getCurrentUser(): CurrentUser {
        val authentication = SecurityContextHolder.getContext().authentication
        val jwt = authentication.principal as? Jwt

        val expireDate = jwt?.expiresAt
        val issuedAt = jwt?.issuedAt
        val userId = jwt?.subject

        if (userId == null || expireDate == null || issuedAt == null) {
            throw BadCredentialsException("Invalid JWT token: missing required claims")
        }

        return CurrentUser(exp = expireDate, sub = userId.toInt(), iat = issuedAt)
    }

    fun login(email: String, password: String): JwtTokenDto {
        val user = userRepository.findByEmail(email)

        if (user.email != email || !securityConfig.passwordEncoder().matches(password, user.password)) {
            throw BadCredentialsException("Invalid credentials")
        }

        return JwtTokenDto(
            token = jwtService.generateToken(user.id),
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
            token = jwtService.generateToken(user.id),
            email = user.email,
            username = user.username,
            userId = user.id,
        )
    }
}
