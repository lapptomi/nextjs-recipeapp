package com.example.demo.user.domain

import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.reciperating.RecipeRating
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime

@Entity
@Table(name = "recipes")
data class Recipe(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int = 0,

    var title: String,

    var description: String,

    var image: String? = null,

    var ingredients: List<String>,

    var cookingTime: Int,

    var servings: Int,

    var instructions: String,

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    var author: User,

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var comments: List<RecipeComment> = listOf(),

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var ratings: List<RecipeRating> = listOf(),

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),
) {
    override fun toString(): String {
        return "Recipe(id=$id, title='$title', description='$description', image=$image, ingredients=$ingredients, cookingTime=$cookingTime, servings=$servings, instructions='$instructions')"
    }
}