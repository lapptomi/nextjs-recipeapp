"use client";

import { useState } from "react";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Box, Button, Chip, Snackbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { createRecipe } from "@/lib/actions/recipe";
import type { CreateRecipePayload, GeneratedRecipe } from "@/types";
import { ROUTES } from "@/types";

import GeneratedRecipeCardHero from "./GeneratedRecipeCardHero";
import IngredientsSection from "./IngredientsSection";
import InstructionsSection from "./InstructionsSection";
import { generateRecipeImage } from "@/lib/actions/openai";

interface GeneratedRecipeCardProps {
  recipe: GeneratedRecipe;
  onAdjust: (adjustment: string) => void;
  onSave?: () => void;
}

export default function GeneratedRecipeCard({
  recipe,
  onAdjust,
  onSave,
}: GeneratedRecipeCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [savedRecipeId, setSavedRecipeId] = useState<number | undefined>(undefined);
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(undefined);
  const [actionError, setActionError] = useState<string | undefined>(undefined);
  const [showSaveSuccessSnackbar, setShowSaveSuccessSnackbar] = useState(false);
  const router = useRouter();

  function handleSaveRecipe() {
    setIsSaving(true);
    setActionError(undefined);

    const recipePayload: CreateRecipePayload = {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      instructions: recipe.instructions.join("\n"),
      category: recipe.category,
    };

    createRecipe(recipePayload)
      .then((createdRecipe) => {
        setSavedRecipeId(createdRecipe.id);
        setShowSaveSuccessSnackbar(true);
        onSave?.();
      })
      .catch((error) => setActionError(`Failed to save recipe: ${error.message}`))
      .finally(() => setIsSaving(false));
  }

  function handleGenerateRecipeImage() {
    setIsGeneratingImage(true);
    setActionError(undefined);

    generateRecipeImage({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
    })
      .then(({ imageBase64 }) => setGeneratedImage(`data:image/png;base64,${imageBase64}`))
      .catch((error) => setActionError(`Failed to generate image: ${error.message}`))
      .finally(() => setIsGeneratingImage(false));
  }

  function handleOpenRecipe() {
    if (!savedRecipeId) return;
    router.push(`${ROUTES.RECIPES}/${savedRecipeId}`);
  }

  return (
    <Box className="w-full overflow-hidden rounded-2xl shadow-lg bg-white">
      <GeneratedRecipeCardHero
        recipe={recipe}
        generatedImage={generatedImage}
        isGeneratingImage={isGeneratingImage}
        onGenerateImage={handleGenerateRecipeImage}
      />

      <Box className="flex flex-col gap-5 p-4 sm:p-6">
        <IngredientsSection ingredients={recipe.ingredients} />
        <InstructionsSection instructions={recipe.instructions} />

        <Box className="flex flex-col gap-4">
          <Typography variant="caption" color="textSecondary">
            QUICK ADJUST
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {recipe.adjustments.map((adjustment) => (
              <Chip
                key={adjustment}
                label={adjustment}
                variant="outlined"
                onClick={() => onAdjust(adjustment)}
              />
            ))}
          </Box>

          <Box className="flex w-full flex-col items-end gap-2">
            <Box>
              {actionError && (
                <Typography variant="caption" color="error">
                  {actionError}
                </Typography>
              )}
            </Box>

            <Box className="flex gap-2">
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveRecipe}
                disabled={isSaving || Boolean(savedRecipeId)}
                loading={isSaving}
                startIcon={<BookmarkBorderIcon />}
              >
                {isSaving ? "Saving..." : savedRecipeId ? "Saved" : "Save Recipe"}
              </Button>

              {savedRecipeId && (
                <Button variant="outlined" size="small" onClick={handleOpenRecipe}>
                  Open Recipe
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={showSaveSuccessSnackbar}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setShowSaveSuccessSnackbar(false);
        }}
        message="Recipe saved successfully!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
