package com.example.demo.auth.controller

import com.example.demo.ApiPath
import com.example.demo.auth.domain.JwtTokenDto
import com.example.demo.auth.domain.LoginDTO
import com.example.demo.auth.service.AuthService
import com.example.demo.user.domain.User
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(ApiPath.ROOT + "/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    fun login(@RequestBody authRequest: LoginDTO): ResponseEntity<JwtTokenDto> {
        return ResponseEntity.ok(authService.login(authRequest.email, authRequest.password))
    }

    @GetMapping("/me")
    fun me(@AuthenticationPrincipal user: User): ResponseEntity<User> {
        return ResponseEntity.ok(user)
    }
}