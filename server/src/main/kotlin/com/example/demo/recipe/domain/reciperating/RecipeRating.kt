package com.example.demo.recipe.domain.reciperating

import com.example.demo.user.domain.Recipe
import com.example.demo.user.domain.User

data class RecipeRating(
    var id: Int = 0,
    var type: RecipeRatingType,
    var recipe: Recipe,
    var author: User,
)

/*
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
*/
