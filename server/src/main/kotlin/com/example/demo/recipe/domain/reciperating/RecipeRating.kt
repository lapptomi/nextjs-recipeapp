package com.example.demo.recipe.domain.reciperating

import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIncludeProperties
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
    @JsonIgnore
    var recipe: Recipe,

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIncludeProperties("id")
    var author: User,
)
