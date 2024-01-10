package com.example.demo.services;

import com.example.demo.dto.NewRecipeCommentDTO;
import com.example.demo.dto.NewRecipeDTO;
import com.example.demo.dto.RecipeRatingDTO;
import com.example.demo.mapper.RecipeCommentMapper;
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

    @Autowired
    S3Service s3Service;

    public List<Recipe> getAll() {
        List<Recipe> recipes = recipeRepository.findAll();
        recipes.forEach(recipe -> {
            if (recipe.getImage() != null) {
                recipe.setImage(s3Service.createPresignedGetUrl(recipe.getImage()));
            }
        });
        return recipes;
    }

    public Optional<Recipe> findById(Long id) {
        Recipe recipe = recipeRepository.findById(id).orElseThrow();
        if (recipe.getImage() != null) {
            recipe.setImage(s3Service.createPresignedGetUrl(recipe.getImage()));
        }
        return recipeRepository.findById(id);
    }

    private String uploadedBackgroundImage(MultipartFile backgroundImage) {
        try {
            return s3Service.uploadFile(backgroundImage);
        } catch (Exception error) {
            throw new RuntimeException("Error while uploading background image", error);
        }
    }

    public Recipe create(String recipeJson, MultipartFile backgroundImage) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            NewRecipeDTO recipeDTO = objectMapper.readValue(recipeJson, NewRecipeDTO.class);

            User user = userRepository.findById(recipeDTO.getAuthorId()).orElseThrow();

            Recipe recipe = Recipe.builder()
                .author(user)
                .servings(recipeDTO.getServings())
                .cookingTime(recipeDTO.getCookingTime())
                .title(recipeDTO.getTitle())
                .description(recipeDTO.getDescription())
                .instructions(recipeDTO.getInstructions())
                .ingredients(recipeDTO.getIngredients())
                .image(backgroundImage != null ? uploadedBackgroundImage(backgroundImage) : null)
                .build();

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
