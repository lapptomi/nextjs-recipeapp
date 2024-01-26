package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.example.demo.dto.NewRecipeDTO;
import com.example.demo.models.Recipe;

@Mapper
public interface RecipeMapper {
    RecipeMapper INSTANCE = Mappers.getMapper(RecipeMapper.class);
    
    NewRecipeDTO toDTO(Recipe recipe);

    Recipe toEntity(NewRecipeDTO recipeDTO);
}
