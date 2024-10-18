package com.example.demo.recipe.repository

import com.example.demo.recipe.domain.reciperating.RecipeRating
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface RecipeRatingRepository: CrudRepository<RecipeRating, Int> {
}