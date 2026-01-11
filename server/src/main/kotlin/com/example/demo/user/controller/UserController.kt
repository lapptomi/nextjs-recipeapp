package com.example.demo.user.controller

import com.example.demo.ApiPath
import com.example.demo.user.domain.CreateUserRequestDTO
import com.example.demo.user.domain.UserDTO
import com.example.demo.user.service.UserService
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(ApiPath.USERS_API)
class UserController(private val userService: UserService) {

    @GetMapping
    fun getUsers(): ResponseEntity<List<UserDTO>> = ResponseEntity.ok(userService.getAll())

    @PostMapping
    fun createUser(@RequestBody user: CreateUserRequestDTO): ResponseEntity<UserDTO> =
        ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user))

    @GetMapping("/{id}")
    fun findUserById(@PathVariable id: Int): ResponseEntity<UserDTO> =
        ResponseEntity.ok(userService.findUserById(id))
}

// Load this controller only in "dev" and "test" spring profiles for cypress e2e testing
@Profile("dev", "test")
@RestController
@RequestMapping(ApiPath.USERS_API)
class DevUserDeleteController(private val userService: UserService) {
    @DeleteMapping
    fun deleteUsers(): ResponseEntity<Unit> =
        ResponseEntity.status(HttpStatus.NO_CONTENT).body(userService.deleteUsers())
}
