"use client";

import { useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CircleIcon from "@mui/icons-material/Circle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Box, Button, Chip, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

import RecipeStatChip from "@/components/RecipeStatChip";
import { createRecipe, generateRecipeImage } from "@/lib/actions/recipe";
import type { CreateRecipePayload, GeneratedRecipe } from "@/types";
import { ROUTES } from "@/types";

interface GeneratedRecipeCardProps {
  recipe: GeneratedRecipe;
  onAdjust: (adjustment: string) => void;
}

export default function GeneratedRecipeCard({ recipe, onAdjust }: GeneratedRecipeCardProps) {
  const [ingredientsOpen, setIngredientsOpen] = useState(true);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [savedRecipeId, setSavedRecipeId] = useState<number | undefined>(undefined);
  const [savedImageUrl, setSavedImageUrl] = useState<string | undefined>(undefined);
  const [actionError, setActionError] = useState<string | undefined>(undefined);
  const [showSaveSuccessSnackbar, setShowSaveSuccessSnackbar] = useState(false);
  const router = useRouter();

  function handleSaveRecipe() {
    if (isSaving || savedRecipeId) return;

    setIsSaving(true);
    setActionError(undefined);

    const recipePayload: CreateRecipePayload = {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      instructions: recipe.instructions.join("\n"),
    };

    createRecipe(recipePayload)
      .then((createdRecipe) => {
        setSavedRecipeId(createdRecipe.id);
        setShowSaveSuccessSnackbar(true);
      })
      .catch((error) => setActionError(`Failed to save recipe: ${error.message}`))
      .finally(() => setIsSaving(false));
  }

  function handleGenerateImage() {
    if (!savedRecipeId || isGeneratingImage) return;

    setIsGeneratingImage(true);
    setActionError(undefined);

    generateRecipeImage(savedRecipeId)
      .then((updatedRecipe) => {
        setSavedImageUrl(updatedRecipe.image ?? undefined);
      })
      .catch((error) => setActionError(`Failed to generate image: ${error.message}`))
      .finally(() => setIsGeneratingImage(false));
  }

  function handleOpenRecipe() {
    if (!savedRecipeId) return;
    router.push(`${ROUTES.RECIPES}/${savedRecipeId}`);
  }

  return (
    <Box className="w-full overflow-hidden rounded-2xl shadow-lg bg-white">
      <Box className="relative h-56 w-full">
        {savedImageUrl ? (
          <>
            <Image src={savedImageUrl} alt={recipe.title} fill className="object-cover" />
            <Box className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.25)_52%,transparent)]" />
          </>
        ) : (
          <>
            <Box className="h-full w-full bg-[radial-gradient(circle_at_top,_#f59e0b,_#fb923c_45%,_#111827)]" />
            <Box className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_35%,rgba(255,255,255,0.08)_58%,transparent_82%)]" />
            <Box className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <Box className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),rgba(0,0,0,0.15)_52%,transparent)]" />
          </>
        )}

        <Button
          size="small"
          onClick={handleGenerateImage}
          disabled={!savedRecipeId || isGeneratingImage}
          className="!absolute right-4 top-4 !rounded-full !border !border-white/25 !bg-white/15 !px-3 !py-1.5 !text-xs !font-semibold !normal-case !text-white !backdrop-blur-sm"
        >
          {isGeneratingImage ? "Generating..." : "Generate image"}
        </Button>

        <Box className="absolute bottom-0 left-0 right-0 z-10 p-5">
          <Box className="mb-3 flex items-center gap-3">
            <Box className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm">
              <RestaurantIcon className="text-white" style={{ fontSize: 22 }} />
            </Box>
            <Box className="min-w-0">
              <Typography
                variant="h5"
                className="truncate font-bold tracking-tight text-white drop-shadow-lg"
              >
                {recipe.title}
              </Typography>
              <Typography className="text-sm leading-relaxed text-white/85 drop-shadow-md">
                {recipe.description}
              </Typography>
            </Box>
          </Box>

          <Box className="flex flex-wrap gap-3">
            <RecipeStatChip icon={<AccessTimeIcon className="text-base" />}>
              <Box className="flex items-center gap-1">
                <Typography variant="body2" fontWeight="bold">
                  {recipe.cookingTime}
                </Typography>
                <Typography variant="caption" className="text-white">
                  min
                </Typography>
              </Box>
            </RecipeStatChip>
            <RecipeStatChip icon={<PeopleOutlineIcon className="text-base" />}>
              <Box className="flex items-center gap-1">
                <Typography variant="body2" fontWeight="bold">
                  {recipe.servings}
                </Typography>
                <Typography variant="caption" className="text-white">
                  servings
                </Typography>
              </Box>
            </RecipeStatChip>
            <RecipeStatChip icon={<WhatshotIcon className="text-base" />}>
              <Typography variant="body2" fontWeight="bold">
                {recipe.difficulty}
              </Typography>
            </RecipeStatChip>
          </Box>
        </Box>
      </Box>

      <Box className="flex flex-col gap-5 p-4 sm:p-6">
        <Box className="rounded-lg bg-gray-50 p-3">
          <Button
            fullWidth
            color="secondary"
            onClick={() => setIngredientsOpen(!ingredientsOpen)}
            className="!justify-between rounded-[14px] px-2 py-2 normal-case"
            endIcon={ingredientsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            <Box className="flex items-center gap-2">
              <Typography variant="caption" fontWeight="bold">
                Ingredients
              </Typography>
              <Typography variant="caption" color="text.disabled">
                ({recipe.ingredients.length})
              </Typography>
            </Box>
          </Button>
          {ingredientsOpen && (
            <Box className="grid grid-cols-2 gap-x-6 gap-y-2">
              {recipe.ingredients.map((item, i) => (
                <Box key={i} className="flex items-center gap-4">
                  <CircleIcon
                    className="flex justify-center items-center size-[6px]"
                    color="primary"
                  />
                  <Typography variant="body1" color="text.secondary">
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box className="rounded-lg bg-gray-50 p-3">
          <Button
            fullWidth
            color="secondary"
            onClick={() => setInstructionsOpen(!instructionsOpen)}
            className="!justify-between rounded-[14px] px-2 py-2 normal-case"
            endIcon={instructionsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            <Box className="flex items-center gap-2">
              <Typography variant="caption" fontWeight="bold">
                Instructions
              </Typography>
              <Typography variant="caption" color="text.disabled">
                ({recipe.instructions.length} steps)
              </Typography>
            </Box>
          </Button>
          {instructionsOpen && (
            <Box className="flex flex-col gap-3">
              {recipe.instructions.map((step, i) => (
                <Box key={i} className="flex gap-3">
                  <Typography variant="body1">{i + 1}.</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

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
