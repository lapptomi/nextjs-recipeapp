package com.example.demo.user.service

import com.example.demo.config.SecurityConfig
import com.example.demo.recipe.domain.RecipeAuthorDTO
import com.example.demo.recipe.domain.recipecomment.RecipeCommentDTO
import com.example.demo.recipe.domain.reciperating.RecipeRatingDTO
import com.example.demo.user.domain.CreateUserDTO
import com.example.demo.user.domain.RecipeDTO
import com.example.demo.user.domain.User
import com.example.demo.user.domain.UserDTO
import com.example.demo.user.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val securityConfig: SecurityConfig
) {
    fun getUsers(): List<UserDTO> {
        return userRepository.findAll().map {
            UserDTO(
                id = it.id,
                username = it.username,
                email = it.email,
                recipes = it.recipes.map {
                    RecipeDTO(
                        id = it.id,
                        title = it.title,
                        description = it.description,
                        image = it.image,
                        ingredients = it.ingredients,
                        cookingTime = it.cookingTime,
                        servings = it.servings,
                        instructions = it.instructions,
                        author = RecipeAuthorDTO(
                            id = it.author.id,
                            username = it.author.username,
                            email = it.author.email
                        ),
                        createdAt = it.createdAt,
                        comments = it.comments.map {
                            RecipeCommentDTO(
                                author = RecipeAuthorDTO(
                                    id = it.author.id,
                                    username = it.author.username,
                                    email = it.author.email
                                ),
                                message = it.message,
                                createdAt = it.createdAt.toString()
                            )
                        },
                        ratings = it.ratings.map {
                            RecipeRatingDTO(
                                author = RecipeAuthorDTO(
                                    id = it.author.id,
                                    username = it.author.username,
                                    email = it.author.email
                                ),
                                type = it.type
                            )
                        }
                    )
                }
            )
        }
    }

    fun createUser(newUser: CreateUserDTO): UserDTO {
        val password = securityConfig.passwordEncoder().encode(newUser.password)
        val savedUser = userRepository.save(User(email = newUser.email, username = newUser.username, password = password))
        return UserDTO(savedUser.id, savedUser.username, savedUser.email)
    }

    fun findUserById(id: Int): UserDTO {
        val user = userRepository.findById(id).orElseThrow {
            throw NoSuchElementException("User with id $id not found")
        }
        return UserDTO(user.id, user.username, user.email)
    }

    fun deleteUsers() = userRepository.deleteAll()
}