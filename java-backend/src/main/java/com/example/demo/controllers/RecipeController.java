package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.models.Recipe;
import com.example.demo.services.RecipeService;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    RecipeService recipeService;

    @GetMapping
    public ResponseEntity<List<Recipe>> getAll() {
        List<Recipe> recipes = recipeService.getAll();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Total-Count", String.valueOf(recipes.size()));
        headers.set("custom-header", "custom-header-value");

        return ResponseEntity.ok()
                .headers(headers)
                .body(recipes);
    }
    
    @PostMapping
    public void create(@RequestBody Recipe recipe) {
        System.out.println("RECIPE CONTROLLER" + recipe);
        // return ResponseEntity.status(HttpStatus.CREATED).body(recipeService.createRecipe(recipe));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> findById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.findById(id).orElseThrow());
    }
    
}
