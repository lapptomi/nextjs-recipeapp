package com.example.demo.mapper;

import org.mapstruct.Mapper;

import com.example.demo.dto.NewRecipeCommentDTO;
import com.example.demo.models.RecipeComment;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RecipeCommentMapper {
    RecipeCommentMapper INSTANCE = Mappers.getMapper(RecipeCommentMapper.class);
    
    NewRecipeCommentDTO toDTO(RecipeComment comment);

    RecipeComment toEntity(NewRecipeCommentDTO commentDTO);
}
