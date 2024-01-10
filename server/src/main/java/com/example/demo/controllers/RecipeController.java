package com.example.demo.controllers;

import java.net.URL;
import java.util.List;
import java.util.Optional;

import com.example.demo.services.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.NewRecipeCommentDTO;
import com.example.demo.dto.RecipeRatingDTO;
import com.example.demo.models.Recipe;
import com.example.demo.models.RecipeComment;
import com.example.demo.models.RecipeRating;
import com.example.demo.services.RecipeService;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin
public class RecipeController {

    @Autowired
    RecipeService recipeService;

    @Autowired
    S3Service s3Service;

    @GetMapping
    public ResponseEntity<List<Recipe>> getAll() {
        List<Recipe> recipes = recipeService.getAll();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Total-Count", String.valueOf(recipes.size()));
        
        return ResponseEntity.ok().headers(headers).body(recipes);
    }

    @PostMapping
    public ResponseEntity<Recipe> create(
            @RequestPart(value = "document") String recipeJson,
            @RequestPart(value = "image", required = false) MultipartFile backgroundImage) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.create(recipeJson, backgroundImage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> findById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.findById(id).orElseThrow());
    }

    @PostMapping("/{recipeId}/comments")
    public ResponseEntity<RecipeComment> addComment(
        @PathVariable Long recipeId,
        @RequestBody NewRecipeCommentDTO comment) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.addComment(recipeId, comment));
    }

    @PostMapping("/{recipeId}/ratings")
    public ResponseEntity<RecipeRating> addRating(
        @PathVariable Long recipeId,
        @RequestBody RecipeRatingDTO rating) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(recipeService.addRating(recipeId, rating));
    }
}
