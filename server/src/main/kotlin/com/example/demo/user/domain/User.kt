package com.example.demo.user.domain

import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.reciperating.RecipeRating
import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime

@Entity
@Table(name = "users")
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator::class, property="@authorId")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    var id: Int = 0,

    @Column(name = "username", unique = true)
    var username: String,

    @Column(name = "email", unique = true)
    var email: String,

    @JsonIgnore
    @Column(name = "password")
    var password: String,

    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    @Column(name = "recipes")
    var recipes: List<Recipe> = listOf(),

    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var comments: List<RecipeComment> = listOf(),

    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var ratings: List<RecipeRating> = listOf(),

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),
) {
    override fun toString(): String {
        return "User(id=$id, email='$email', username='$username')"
    }
}