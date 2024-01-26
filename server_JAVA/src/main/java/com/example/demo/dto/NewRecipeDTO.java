package com.example.demo.dto;

import lombok.Data;

@Data
public class NewRecipeDTO {
    private String title;
    private String description;
    private String[] ingredients;
    private String instructions;
    private int cookingTime;
    private int servings;
}
