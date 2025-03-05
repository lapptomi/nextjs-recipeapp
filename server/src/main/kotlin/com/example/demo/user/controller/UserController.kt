package com.example.demo.user.controller

import com.example.demo.ApiPath
import com.example.demo.user.domain.dto.CreateUserRequestDTO
import com.example.demo.user.domain.dto.UserDTO
import com.example.demo.user.service.UserService
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
@RequestMapping(ApiPath.ROOT + "/users")
class UserController(private val userService: UserService) {
    @GetMapping
    fun getUsers(): ResponseEntity<List<UserDTO>> = ResponseEntity.ok(userService.getUsers())

    @PostMapping
    fun createUser(@RequestBody user: CreateUserRequestDTO): ResponseEntity<UserDTO> =
        ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user))

    @DeleteMapping
    fun deleteUsers(): ResponseEntity<Unit> =
        ResponseEntity.status(HttpStatus.NO_CONTENT).body(userService.deleteUsers())

    @GetMapping("/{id}")
    fun findUserById(@PathVariable id: Int): ResponseEntity<UserDTO> =
        ResponseEntity.ok(userService.findUserById(id))
}
