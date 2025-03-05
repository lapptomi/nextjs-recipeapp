package com.example.demo.recipe.repository

import com.example.demo.recipe.domain.recipecomment.RecipeComment
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository interface RecipeCommentRepository : CrudRepository<RecipeComment, Int>
