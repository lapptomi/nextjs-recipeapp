package com.example.demo.recipe.domain.recipecomment

import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import java.util.Date

@Entity
@Table(name = "recipe_comments")
data class RecipeComment(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    var message: String,

    @ManyToOne
    @JoinColumn(name = "recipe_id", nullable = false)
    @JsonIgnore
    val recipe: Recipe,

    @ManyToOne
    @JoinColumn(name = "author_id")
    val author: User,

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    var createdAt: Date = Date()
)