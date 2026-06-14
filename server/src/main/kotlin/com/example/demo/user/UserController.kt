package com.example.demo.user

import com.example.demo.ApiPath
import com.example.demo.user.domain.CreateUserRequest
import com.example.demo.user.domain.UpdateUserRequest
import com.example.demo.user.domain.UserResponse
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

    @GetMapping fun getUsers(): ResponseEntity<List<UserResponse>> = ResponseEntity.ok(userService.getAll())

    @PostMapping
    fun createUser(@RequestBody user: CreateUserRequest): ResponseEntity<UserResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user))

    @GetMapping("/{id}")
    fun findUserById(@PathVariable id: Int): ResponseEntity<UserResponse> =
        ResponseEntity.ok(userService.findUserById(id))

    @GetMapping("/{id}/followers")
    fun getFollowers(@PathVariable id: Int): ResponseEntity<List<UserResponse>> =
        ResponseEntity.ok(userService.getUserFollowers(id))

    @GetMapping("/{id}/following")
    fun getFollowing(@PathVariable id: Int): ResponseEntity<List<UserResponse>> =
        ResponseEntity.ok(userService.getUserFollowing(id))

    @DeleteMapping("/{id}/followers")
    fun unfollowUser(@PathVariable id: Int): ResponseEntity<Void> {
        userService.unfollowUser(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/me")
    fun updateUser(@RequestBody updatedUserInfo: UpdateUserRequest): ResponseEntity<Void> {
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
