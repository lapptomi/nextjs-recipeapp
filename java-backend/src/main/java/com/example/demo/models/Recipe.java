package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@Table(name = "recipe")
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "instructions", nullable = false)
    private String instructions;

    @Column(name = "ingredients", columnDefinition = "TEXT[]")
    private String[] ingredients;

    @Column(name = "image", nullable = false, columnDefinition = "TEXT DEFAULT null")
    private String image;

    @Column(name = "cooking_time", nullable = false, columnDefinition = "INTEGER DEFAULT 0")
    private Integer cookingTime;

    @Column(name = "servings", nullable = false, columnDefinition = "INTEGER DEFAULT 0")
    private Integer servings;

    @OneToMany(mappedBy = "recipe")
    private List<RecipeComment> comments;

    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonIgnoreProperties("recipes")
    private User author;

    @OneToMany(mappedBy = "recipe")
    private List<RecipeRating> ratings;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP")
    private Timestamp updatedAt;
   
}
