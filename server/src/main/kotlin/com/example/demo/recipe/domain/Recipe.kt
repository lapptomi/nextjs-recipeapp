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

    @Column(name = "title", nullable = false, length = 200)
    var title: String,

    @Column(name = "description", nullable = false, length = 1000)
    var description: String,

    @Column(name = "image", length = 5000)
    var image: String? = null,

    @Column(name = "ingredients", length = 500)
    var ingredients: List<String>,

    @Column(name = "cooking_time")
    var cookingTime: Int,

    @Column(name = "servings")
    var servings: Int = 0,

    @Column(name = "instructions", nullable = false, length = 5000)
    var instructions: String,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
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