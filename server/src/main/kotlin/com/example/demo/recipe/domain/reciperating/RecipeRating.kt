package com.example.demo.recipe.domain.reciperating

import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

@Entity
@Table(
    name = "recipe_ratings",
    uniqueConstraints = [UniqueConstraint(columnNames = ["recipe_id", "user_id"])],
)
data class RecipeRating(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int = 0,
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    var type: RecipeRatingType,
    @ManyToOne @JoinColumn(name = "recipe_id", nullable = false) var recipe: Recipe,
    @ManyToOne @JoinColumn(name = "user_id", nullable = false) var author: User,
)
