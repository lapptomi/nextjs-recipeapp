package com.example.demo.user.domain

import com.example.demo.recipe.domain.recipecomment.RecipeComment
import com.example.demo.recipe.domain.reciperating.RecipeRating
import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.LocalDateTime
import org.springframework.data.annotation.CreatedDate

@Entity
@Table(name = "users")
@JsonIdentityInfo(
    generator = ObjectIdGenerators.IntSequenceGenerator::class,
    property = "@authorId",
)
data class User(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE) @Column(name = "id") var id: Int = 0,
    @Column(name = "username", unique = true, length = 30) var username: String,
    @Column(name = "email", unique = true, length = 100) var email: String,
    @JsonIgnore @Column(name = "password") var password: String,
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
    override fun toString(): String = "User(id=$id, email='$email', username='$username')"
}
