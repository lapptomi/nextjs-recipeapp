package com.example.demo.user.controller

import com.example.demo.ApiPath
import com.example.demo.user.service.UserService
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

// Load this controller only in "dev" or "test" spring profile for cypress e2e testing
@Profile("dev", "test")
@RestController
@RequestMapping(ApiPath.USERS_API)
class UserTestController(private val userService: UserService) {
    @DeleteMapping
    fun deleteUsers(): ResponseEntity<Unit> =
        ResponseEntity.status(HttpStatus.NO_CONTENT).body(userService.deleteUsers())
}
