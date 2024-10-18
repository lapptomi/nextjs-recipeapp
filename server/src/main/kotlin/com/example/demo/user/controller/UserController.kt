package com.example.demo.user.controller

import com.example.demo.ApiPath
import com.example.demo.user.domain.NewUserDTO
import com.example.demo.user.domain.User
import com.example.demo.user.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(ApiPath.ROOT + "/users")
class UserController(@Autowired private val userService: UserService) {

    @GetMapping
    fun getUsers(): ResponseEntity<MutableIterable<User>> =
        ResponseEntity.ok(userService.getUsers())

    @PostMapping
    fun createUser(@RequestBody user: NewUserDTO): ResponseEntity<User> =
        ResponseEntity
            .status(HttpStatus.CREATED)
            .body(userService.createUser(user))

    @DeleteMapping
    fun deleteUsers(): ResponseEntity<Unit> =
        ResponseEntity.status(HttpStatus.NO_CONTENT).body(userService.deleteUsers())

    @GetMapping("/{id}")
    fun findUserById(@PathVariable id: Int): ResponseEntity<User> {
        return ResponseEntity.ok(userService.findUserById(id))
    }
}