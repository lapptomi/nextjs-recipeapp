package com.example.demo.controllers;

import com.example.demo.dto.NewRecipeCommentDTO;
import com.example.demo.dto.RecipeRatingDTO;
import com.example.demo.models.Recipe;
import com.example.demo.models.RecipeComment;
import com.example.demo.models.RecipeRating;
import com.example.demo.services.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin
public class RecipeController {

    @Autowired
    RecipeService recipeService;

    @GetMapping
    public ResponseEntity<Page<Recipe>> getAll(
            @RequestParam(defaultValue = "", required = false) String title,
            @RequestParam(defaultValue = "1", required = false) int page,
            @RequestParam(defaultValue = "12", required = false) int pageSize,
            @RequestParam(required = false) String sortby) {
        Page<Recipe> recipes = recipeService.getBySearchParams(title, page, pageSize, sortby);
        return ResponseEntity.ok().body(recipes);
    }

    @PostMapping
    public ResponseEntity<Recipe> create(
            @RequestHeader("Authorization") String bearerToken,
            @RequestPart(value = "document") String recipeJson,
            @RequestPart(value = "image", required = false) MultipartFile backgroundImage) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.create(recipeJson, backgroundImage, bearerToken));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> findById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.findById(id));
    }

    @PostMapping("/{recipeId}/comments")
    public ResponseEntity<RecipeComment> addComment(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Long recipeId,
            @RequestBody NewRecipeCommentDTO comment) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.addComment(recipeId, comment, bearerToken));
    }

    @PostMapping("/{recipeId}/ratings")
    public ResponseEntity<RecipeRating> addRating(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable Long recipeId,
            @RequestBody RecipeRatingDTO ratingDTO) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.addRating(recipeId, ratingDTO, bearerToken));
    }
}
