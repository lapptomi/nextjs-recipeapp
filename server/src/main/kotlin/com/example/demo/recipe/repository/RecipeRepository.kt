package com.example.demo.user.repository

import com.example.demo.user.domain.Recipe
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface RecipeRepository : CrudRepository<Recipe, Int> {
    fun findByTitleContainingIgnoreCase(title: String, pageable: Pageable): Page<Recipe>
}
