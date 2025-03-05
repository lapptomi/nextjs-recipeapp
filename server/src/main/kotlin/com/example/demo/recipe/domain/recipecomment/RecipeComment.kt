package com.example.demo.recipe.domain.recipecomment

import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.Date
import org.springframework.data.annotation.CreatedDate

@Entity
@Table(name = "recipe_comments")
data class RecipeComment(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int? = null,
    @Column(name = "message", nullable = false, length = 500) var message: String,
    @ManyToOne @JoinColumn(name = "recipe_id", nullable = false) val recipe: Recipe,
    @ManyToOne @JoinColumn(name = "user_id", nullable = false) val author: User,
    @CreatedDate @Column(name = "created_at", nullable = false) var createdAt: Date = Date(),
)
