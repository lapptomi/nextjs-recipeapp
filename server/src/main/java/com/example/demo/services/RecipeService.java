package com.example.demo.services;

import com.example.demo.dto.NewRecipeCommentDTO;
import com.example.demo.dto.NewRecipeDTO;
import com.example.demo.dto.RecipeRatingDTO;
import com.example.demo.mapper.RecipeCommentMapper;
import com.example.demo.mapper.RecipeMapper;
import com.example.demo.models.Recipe;
import com.example.demo.models.RecipeComment;
import com.example.demo.models.RecipeRating;
import com.example.demo.models.User;
import com.example.demo.repositories.RecipeCommentRepository;
import com.example.demo.repositories.RecipeRatingRepository;
import com.example.demo.repositories.RecipeRepository;
import com.example.demo.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    @Autowired
    RecipeRepository recipeRepository;

    @Autowired
    RecipeCommentRepository recipeCommentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RecipeRatingRepository recipeRatingRepository;

    public List<Recipe> getAll() {
        return recipeRepository.findAll();
    }

    public Optional<Recipe> findById(Long id) {
        return recipeRepository.findById(id);
    }

    public Recipe create(String recipeJson, Optional<MultipartFile> backgroundImage) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            NewRecipeDTO recipeDTO = objectMapper.readValue(recipeJson, NewRecipeDTO.class);
            User user = userRepository.findById(recipeDTO.getAuthorId()).orElseThrow();

            Recipe recipe = RecipeMapper.INSTANCE.toEntity(recipeDTO);
            recipe.setAuthor(user);
            return recipeRepository.save(recipe);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public RecipeComment addComment(Long recipeId, NewRecipeCommentDTO comment) {
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
        User user = userRepository.findById(comment.getAuthorId()).orElseThrow();

        RecipeComment newComment = RecipeCommentMapper.INSTANCE.toEntity(comment);
        newComment.setAuthor(user);
        newComment.setRecipe(recipe);

        return recipeCommentRepository.save(newComment);
    }

    public RecipeRating addRating(Long recipeId, RecipeRatingDTO ratingDTO) {
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
        User user = userRepository.findById(ratingDTO.getAuthorId()).orElseThrow();
    
        RecipeRating existingRating = recipeRatingRepository
                .findByAuthor_IdAndRecipe_Id(user.getId(), recipe.getId());
    
        RecipeRating rating = Optional.ofNullable(existingRating).orElse(new RecipeRating());
    
        if (existingRating == null) {
            rating.setAuthor(user);
            rating.setRecipe(recipe);
        }
    
        rating.setType(ratingDTO.getType());
        return recipeRatingRepository.save(rating);
    }
}
