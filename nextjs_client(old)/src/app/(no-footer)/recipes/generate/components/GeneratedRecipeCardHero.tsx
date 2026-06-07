"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

import RecipeStatChip from "@/components/RecipeStatChip";
import type { GeneratedRecipe } from "@/types";

interface GeneratedRecipeCardHeroProps {
  recipe: GeneratedRecipe;
  generatedImage?: string;
  isGeneratingImage: boolean;
  onGenerateImage: () => void;
}

export default function GeneratedRecipeCardHero({
  recipe,
  generatedImage,
  isGeneratingImage,
  onGenerateImage,
}: GeneratedRecipeCardHeroProps) {
  return (
    <Box className="relative flex flex-col overflow-hidden bg-orange-500">
      {generatedImage && (
        <Image src={generatedImage} alt={recipe.title} fill className="object-cover" />
      )}
      <Box className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      <Box className="z-10 flex flex-1 flex-col justify-between p-5 gap-3">
        <Box className="flex items-start justify-between gap-2">
          <Button
            size="small"
            onClick={onGenerateImage}
            loading={isGeneratingImage}
            loadingPosition="start"
            startIcon={<AutoAwesomeIcon sx={{ fontSize: "12px !important" }} />}
            className="!ml-auto !rounded-full !border !border-white/25 !bg-white/15 !px-3 !py-1.5 !text-xs !font-semibold !normal-case !text-white !backdrop-blur-sm"
          >
            {isGeneratingImage ? "Generating..." : "Generate image"}
          </Button>
        </Box>
        <Box>
          <Typography
            variant="h5"
            color="text.primaryLight"
            className="truncate font-bold tracking-tight drop-shadow-lg"
          >
            {recipe.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondaryLight"
            className="leading-relaxed drop-shadow-md"
          >
            {recipe.description}
          </Typography>
        </Box>

        <Box className="flex flex-wrap gap-3">
          <RecipeStatChip icon={<AccessTimeIcon className="text-base" />}>
            <Box className="flex items-center gap-1">
              <Typography variant="body2" fontWeight="bold">
                {recipe.cookingTime}
              </Typography>
              <Typography variant="caption" color="text.primaryLight">
                min
              </Typography>
            </Box>
          </RecipeStatChip>
          <RecipeStatChip icon={<PeopleOutlineIcon className="text-base" />}>
            <Box className="flex items-center gap-1">
              <Typography variant="body2" fontWeight="bold">
                {recipe.servings}
              </Typography>
              <Typography variant="caption" color="text.primaryLight">
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
  );
}
