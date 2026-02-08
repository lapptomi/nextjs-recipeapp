package com.example.demo.user.service

import com.example.demo.recipe.mapper.toRecipeListItemDTO
import com.example.demo.recipe.repository.RecipeRepository
import com.example.demo.s3.S3Service
import com.example.demo.user.domain.CreateUserRequestDTO
import com.example.demo.user.domain.UpdateUserRequestDTO
import com.example.demo.user.domain.User
import com.example.demo.user.domain.UserDTO
import com.example.demo.user.mapper.toUserDTO
import com.example.demo.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val passwordEncoder: PasswordEncoder,
    private val userRepository: UserRepository,
    private val recipeRepository: RecipeRepository,
    private val s3Service: S3Service,
) {

    fun getAll(): List<UserDTO> {
        val users = userRepository.fetchUsers()
        return users.map { it.toUserDTO() }
    }

    fun createUser(newUser: CreateUserRequestDTO): UserDTO {
        val password = validatePassword(newUser.password)
        val passwordHash = passwordEncoder.encode(password)
        val createdUser = userRepository.createUser(newUser.username, newUser.email, passwordHash)
        return createdUser.toUserDTO()
    }

    fun findUserById(id: Int): UserDTO {
        val user = userRepository.findUserById(id)
        val recipes =
            recipeRepository.fetchUserRecipes(user.id).map {
                it.toRecipeListItemDTO(
                    totalRatings = recipeRepository.fetchTotalRatingsForRecipe(it.id),
                    averageRating = recipeRepository.fetchAverageRatingForRecipe(it.id),
                    presignedUrl = it.image?.let { imageName -> s3Service.getPresignedUrl(imageName) },
                )
            }
        return user.toUserDTO(recipes)
    }

    fun deleteUser(user: User) {
        userRepository.deleteById(user.id)
    }

    fun updateUser(user: User, updatedUser: UpdateUserRequestDTO) {
        userRepository.updateUser(user.id, updatedUser.username, updatedUser.email)
    }

    fun deleteUsers() {
        userRepository.deleteAll()
    }

    private fun validatePassword(password: String): String {
        if (password.isEmpty()) throw IllegalArgumentException("Password cannot be null or empty")
        if (password.length < 8) throw IllegalArgumentException("Password must be at least 8 characters long")
        return password
    }

    fun followUser(followerId: Int, userToFollowId: Int) {
        if (followerId == userToFollowId) throw IllegalArgumentException("Users cannot follow themselves")
        userRepository.addFollower(followerId, userToFollowId)
    }

    fun getUserFollowers(userId: Int): List<UserDTO> {
        val followers = userRepository.getUserFollowers(userId)
        return followers.map { it.toUserDTO() }
    }

    fun unfollowUser(followerId: Int, userToUnfollowId: Int) {
        userRepository.removeFollower(followerId, userToUnfollowId)
    }

    fun getUserFollowing(userId: Int): List<UserDTO> {
        val following = userRepository.getUserFollowing(userId)
        return following.map { it.toUserDTO() }
    }
}
