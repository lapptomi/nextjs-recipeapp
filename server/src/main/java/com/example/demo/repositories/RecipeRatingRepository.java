package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.RecipeRating;

public interface RecipeRatingRepository extends JpaRepository<RecipeRating, Long> {
    RecipeRating findByAuthor_IdAndRecipe_Id(Long authorId, Long recipeId);
}
