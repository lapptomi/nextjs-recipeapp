"use client";

import { useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { Recipe } from "@/types";

const SHOPPING_TIPS = [
  "Check your pantry before heading to the store",
  "Tap items to mark them as collected while shopping",
  "Bookmark this page for quick access at the store",
  "Buy fresh ingredients on the day you plan to cook",
];

interface Props {
  recipe: Recipe;
}

export default function IngredientsShoppingList({ recipe }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const totalItems = recipe.ingredients.length;
  const collectedItems = checked.size;
  const progress = totalItems > 0 ? (collectedItems / totalItems) * 100 : 0;
  const allItemsCollected = collectedItems === totalItems;

  function toggleItem(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="relative h-52 overflow-hidden bg-gray-900">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : (
          <Box className="flex h-full items-center justify-center">
            <RestaurantIcon style={{ fontSize: 80 }} className="text-gray-600" />
          </Box>
        )}

        <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30">
          <Box className="p-4">
            <Link href={`/recipes/${recipe.id}`}>
              <Button startIcon={<ArrowBackIcon />} color="info" size="small" variant="outlined">
                Back to Recipe
              </Button>
            </Link>
          </Box>

          <Box className="absolute bottom-5 left-5 flex flex-col gap-2">
            <Box className="flex items-center gap-3">
              <Box className="flex size-10 items-center justify-center rounded-full bg-orange-500">
                <ShoppingCartIcon className="!text-white" fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="textPrimaryLight">
                  Shopping List
                </Typography>
                <Typography variant="body1" color="textSecondaryLight">
                  {recipe.title}
                </Typography>
              </Box>
            </Box>
            {recipe.category && (
              <Chip
                label={recipe.category}
                size="small"
                className="!w-fit !bg-orange-500 !text-white"
              />
            )}
          </Box>
        </Box>
      </Box>

      <Box className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        <Box className="flex items-start justify-between">
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Ingredients
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {collectedItems} of {totalItems} items collected
            </Typography>
            {allItemsCollected && (
              <Box className="flex items-center gap-1">
                <CheckIcon fontSize="small" color="success" />
                <Typography variant="body1" color="success">
                  Complete!
                </Typography>
              </Box>
            )}
          </Box>
          <Chip label={`${recipe.servings} servings`} variant="outlined" size="small" />
        </Box>

        <LinearProgress
          variant="determinate"
          color={!allItemsCollected ? "primary" : "success"}
          value={progress}
          className="!h-2 !rounded-full"
        />

        <Paper variant="outlined" className="overflow-hidden rounded-2xl">
          {recipe.ingredients.map((ingredient, index) => {
            const isChecked = checked.has(index);
            return (
              <Box key={index}>
                <Box
                  className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
                  onClick={() => toggleItem(index)}
                >
                  <Box className="flex items-center gap-2">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleItem(index)}
                      onClick={(e) => e.stopPropagation()}
                      color="default"
                    />
                    <Typography
                      variant="body1"
                      className={isChecked ? "!text-gray-400 !line-through" : undefined}
                    >
                      {ingredient}
                    </Typography>
                  </Box>
                  {isChecked && <CheckIcon fontSize="small" color="success" />}
                </Box>
                {index < recipe.ingredients.length - 1 && <Divider />}
              </Box>
            );
          })}
        </Paper>

        <Paper variant="outlined" className="rounded-2xl p-4 bg-gray-100">
          <Box className="mb-3 flex items-center gap-3">
            <Box className="flex size-8 items-center justify-center rounded-full bg-orange-500">
              <LightbulbIcon className="!text-white" fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              Shopping Tips
            </Typography>
          </Box>
          <Box className="flex flex-col gap-1.5">
            {SHOPPING_TIPS.map((tip, i) => (
              <Typography key={i} variant="body2" color="textSecondary">
                • {tip}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
