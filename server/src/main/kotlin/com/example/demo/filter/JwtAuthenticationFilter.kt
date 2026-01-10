package com.example.demo.filter

import com.example.demo.auth.service.JwtService
import com.example.demo.user.domain.UserV2
import com.example.demo.user.repository.UserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.io.IOException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userRepository: UserRepository,
) : OncePerRequestFilter() {
    @Throws(Exception::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val header = request.getHeader("Authorization")
        val token = header?.substring(7) // remove "Bearer " from token

        if (token != null) {
            val email = jwtService.extractEmail(token)
            if (jwtService.validateToken(token, email)) {
                updateSecurityContext(userRepository.findByEmail(email), request)
            }
        }

        filterChain.doFilter(request, response)
    }

    /*
    private fun updateSecurityContext(user: User, request: HttpServletRequest) {
        val authToken = UsernamePasswordAuthenticationToken(user, null, emptyList())
        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authToken
    }
     */

    private fun updateSecurityContext(user: UserV2, request: HttpServletRequest) {
        val authToken = UsernamePasswordAuthenticationToken(user, null, emptyList())
        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authToken
    }
}
