package com.example.demo.recipe.domain.reciperating

import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import jakarta.persistence.*

@Entity
@Table(name = "recipe_ratings")
data class RecipeRating(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int = 0,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    var type: RecipeRatingType,

    @ManyToOne
    @JoinColumn(name = "recipe_id", nullable = false)
    var recipe: Recipe,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    var author: User,
)
