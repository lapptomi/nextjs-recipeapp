package com.example.demo.dto;

import lombok.Data;

@Data
public class NewRecipeCommentDTO {
    private Long authorId;
    private String message;
}

