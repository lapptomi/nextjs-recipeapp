"use client";

import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Box, Button, Typography } from "@mui/material";
import type { Session } from "next-auth/core/types";

import { addRating, updateRating } from "@/lib/actions/recipe";
import type { Recipe, RecipeRatingType } from "@/types";
import { theme } from "@/lib/theme";

export default function LikeButtons({
  recipe,
  session,
}: {
  recipe: Recipe;
  session: Session | null;
}) {
  const likes = recipe.ratings.filter((r) => r.type === "LIKE").length;
  const dislikes = recipe.ratings.filter((r) => r.type === "DISLIKE").length;

  const userHasRatedThisType = (ratingType: RecipeRatingType) =>
    recipe.ratings.some((r) => r.author.id === Number(session?.user.id) && r.type === ratingType);

  const userHasRatedAny = () =>
    recipe.ratings.some((r) => r.author.id === Number(session?.user.id));

  const handleClickRating = async (ratingType: RecipeRatingType) => {
    if (!session?.user) {
      return;
    }

    if (userHasRatedAny()) {
      updateRating({ recipeId: recipe.id, type: ratingType })
        .then(() => window.location.reload())
        .catch((error) => console.log(error));
    } else {
      addRating({ recipeId: recipe.id, type: ratingType })
        .then(() => window.location.reload())
        .catch((error) => console.log(error));
    }
  };

  return (
    <Box className="flex flex-row items-center gap-3">
      <Button
        disabled={session === null}
        size="small"
        onClick={() => handleClickRating("LIKE")}
        variant="contained"
        startIcon={<ThumbUpIcon color="info" />}
        className={userHasRatedThisType("LIKE") ? theme.palette.secondary.main : "bg-transparent"}
      >
        <Typography variant="overline" color="text.primaryLight" data-testid="like-count">
          {likes}
        </Typography>
      </Button>
      <Button
        disabled={session === null}
        className={userHasRatedThisType("DISLIKE") ? "bg-zinc-800" : "bg-transparent"}
        size="small"
        onClick={() => handleClickRating("DISLIKE")}
        variant="contained"
        startIcon={<ThumbDownIcon color={userHasRatedThisType("DISLIKE") ? "info" : "info"} />}
      >
        <Typography variant="overline" color="text.primaryLight" data-testid="dislike-count">
          {dislikes}
        </Typography>
      </Button>
    </Box>
  );
}
