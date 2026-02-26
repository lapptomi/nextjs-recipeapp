package com.example.demo.user.controller

import com.example.demo.ApiPath
import com.example.demo.user.domain.CreateUserRequestDTO
import com.example.demo.user.domain.UpdateUserRequestDTO
import com.example.demo.user.domain.UserDTO
import com.example.demo.user.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(ApiPath.USERS_API)
class UserController(private val userService: UserService) {

    @GetMapping fun getUsers(): ResponseEntity<List<UserDTO>> = ResponseEntity.ok(userService.getAll())

    @PostMapping
    fun createUser(@RequestBody user: CreateUserRequestDTO): ResponseEntity<UserDTO> =
        ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user))

    @GetMapping("/{id}")
    fun findUserById(@PathVariable id: Int): ResponseEntity<UserDTO> = ResponseEntity.ok(userService.findUserById(id))

    @GetMapping("/{id}/followers")
    fun getFollowers(@PathVariable id: Int): ResponseEntity<List<UserDTO>> =
        ResponseEntity.ok(userService.getUserFollowers(id))

    @GetMapping("/{id}/following")
    fun getFollowing(@PathVariable id: Int): ResponseEntity<List<UserDTO>> =
        ResponseEntity.ok(userService.getUserFollowing(id))

    @DeleteMapping("/{id}/followers")
    fun unfollowUser(@PathVariable id: Int): ResponseEntity<Void> {
        userService.unfollowUser(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/me")
    fun updateUser(@RequestBody updatedUserInfo: UpdateUserRequestDTO): ResponseEntity<Void> {
        userService.updateUser(updatedUserInfo)
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/me")
    fun deleteUser(): ResponseEntity<Void> {
        userService.deleteUser()
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/follow/{id}")
    fun followUser(@PathVariable id: Int): ResponseEntity<Void> {
        userService.followUser(id)
        return ResponseEntity.ok().build()
    }
}
