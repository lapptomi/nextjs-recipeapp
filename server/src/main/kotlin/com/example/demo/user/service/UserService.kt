package com.example.demo.user.service

import com.example.demo.recipe.mapper.toRecipeDTO
import com.example.demo.recipe.repository.RecipeRepository
import com.example.demo.s3.S3Service
import com.example.demo.user.domain.CreateUserRequestDTO
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
        val password = passwordEncoder.encode(newUser.password)
        val createdUser = userRepository.createUser(newUser.username, newUser.email, password)
        return createdUser.toUserDTO()
    }

    fun findUserById(id: Int): UserDTO {
        val user = userRepository.findById(id)
        val recipes =
            recipeRepository.fetchUserRecipes(user.id).map {
                it.toRecipeDTO(
                    presignedUrl =
                        it.image?.let { imageName -> s3Service.getPresignedUrl(imageName) },
                    comments = emptyList(),
                    ratings = recipeRepository.fetchRecipeRatings(it.id),
                )
            }
        return user.toUserDTO(recipes)
    }

    fun deleteUsers() {
        userRepository.deleteAll()
    }
}
