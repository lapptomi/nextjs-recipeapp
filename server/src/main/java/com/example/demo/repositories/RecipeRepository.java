package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.models.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
}
