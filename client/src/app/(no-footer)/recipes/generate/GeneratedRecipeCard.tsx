"use client";

import { useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CircleIcon from "@mui/icons-material/Circle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Box, Button, Chip, Divider, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { saveGeneratedRecipe } from "@/lib/actions/openai";
import type { GeneratedRecipe } from "@/lib/actions/openai";
import { ROUTES } from "@/types";

interface GeneratedRecipeCardProps {
  recipe: GeneratedRecipe;
  onAdjust: (adjustment: string) => void;
}

const SUPPORTED_CATEGORIES = new Set(["breakfast", "lunch", "dinner", "dessert", "snack"]);

export default function GeneratedRecipeCard({ recipe, onAdjust }: GeneratedRecipeCardProps) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecipeId, setSavedRecipeId] = useState<number | undefined>(undefined);
  const [savedImageUrl, setSavedImageUrl] = useState<string | undefined>(undefined);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const [showSaveSuccessSnackbar, setShowSaveSuccessSnackbar] = useState(false);
  const router = useRouter();

  function handleSaveRecipe() {
    if (isSaving || savedRecipeId) return;

    const category = recipe.tags
      .map((tag) => tag.trim().toLowerCase())
      .find((tag) => SUPPORTED_CATEGORIES.has(tag));

    setIsSaving(true);
    setSaveError(undefined);

    saveGeneratedRecipe({
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      category,
    })
      .then((createdRecipe) => {
        setSavedRecipeId(createdRecipe?.id);
        setSavedImageUrl(createdRecipe?.image ?? undefined);
        setShowSaveSuccessSnackbar(true);
      })
      .catch((error) => setSaveError(`Failed to save recipe: ${error.message}`))
      .finally(() => setIsSaving(false));
  }

  function handleOpenRecipe() {
    if (!savedRecipeId) return;
    router.push(`${ROUTES.RECIPES}/${savedRecipeId}`);
  }

  return (
    <Box className="w-full overflow-hidden rounded-2xl shadow-lg bg-white">
      <Box
        className={`relative h-56 w-full ${savedImageUrl ? "" : "bg-gray-200 border-y border-gray-300"}`}
      >
        {savedImageUrl ? (
          <>
            <Image src={savedImageUrl} alt={recipe.title} fill className="object-cover" />
            <Box className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.6),rgba(0,0,0,0.2)_50%,transparent)]" />
          </>
        ) : (
          <Box className="flex h-full items-center justify-center">
            <RestaurantIcon className="text-gray-400 drop-shadow-sm" style={{ fontSize: 80 }} />
          </Box>
        )}
        <Box className="absolute bottom-4 left-4 flex gap-3">
          <Chip
            icon={<AccessTimeIcon className="text-base" />}
            label={
              <Box className="flex items-center gap-1">
                <Typography variant="body2" fontWeight="bold">
                  {recipe.cookingTime}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  min
                </Typography>
              </Box>
            }
            size="small"
            className="h-9 rounded-full bg-white/95 px-2 shadow-lg"
          />
          <Chip
            icon={<PeopleOutlineIcon className="text-base" />}
            label={
              <Box className="flex items-center gap-1">
                <Typography variant="body2" fontWeight="bold">
                  {recipe.servings}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  servings
                </Typography>
              </Box>
            }
            size="small"
            className="h-9 rounded-full bg-white/95 px-2 shadow-lg"
          />
          <Chip
            icon={<WhatshotIcon className="text-base" />}
            label={
              <Typography variant="body2" fontWeight="bold">
                {recipe.difficulty}
              </Typography>
            }
            size="small"
            className="h-9 rounded-full bg-white/95 px-2 shadow-lg"
          />
        </Box>
      </Box>

      <Box className="flex flex-col gap-5 p-4 sm:p-6">
        <Box className="flex gap-4">
          <Box className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-secondary-main shadow-md">
            <AutoAwesomeIcon className="text-2xl text-white" />
          </Box>
          <Box className="flex flex-col gap-1">
            <Typography variant="h6" fontWeight="bold">
              {recipe.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {recipe.description}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="flex flex-col gap-3">
          <Box className="flex items-center gap-2">
            <Typography variant="body2" fontWeight="bold">
              Ingredients
            </Typography>
            <Typography variant="caption" color="text.disabled">
              ({recipe.ingredients.length})
            </Typography>
          </Box>
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

        <Box className="flex flex-wrap flex-col gap-1">
          <Typography variant="caption" color="textSecondary">
            TAGS
          </Typography>
          <Box className="flex gap-1">
            {recipe.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Divider />

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
              {saveError && (
                <Typography variant="caption" color="error">
                  {saveError}
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
