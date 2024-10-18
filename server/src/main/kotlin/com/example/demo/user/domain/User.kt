package com.example.demo.user.domain

import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.reciperating.RecipeRating
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
    var id: Int = 0,

    @Column(unique = true)
    var username: String,

    @Column(unique = true)
    var email: String,

    @JsonIgnore
    var password: String,

    @JsonIgnoreProperties("author", "comments")
    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var recipes: List<Recipe> = listOf(),

    @JsonIgnore
    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var comments: List<RecipeComment> = listOf(),

    @JsonIgnore
    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var ratings: List<RecipeRating> = listOf()
) {
    override fun toString(): String {
        return "User(id=$id, email='$email', username='$username')"
    }
}