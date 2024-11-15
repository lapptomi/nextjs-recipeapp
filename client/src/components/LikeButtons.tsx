/* eslint-disable no-null/no-null */
"use client";

import { useState } from "react";

import { Share, ThumbDown, ThumbUpSharp } from "@mui/icons-material";
import { Button, Snackbar, Tooltip, Typography } from "@mui/material";

import { addRating } from "@/lib/actions/recipe";

import type { Recipe, RecipeRatingType } from "@/types";
import type { Session } from "next-auth/core/types";

interface Props {
  recipe: Recipe;
  session: Session | null;
}

const LikeButtons = ({ recipe, session }: Props) => {
  const [open, setOpen] = useState(false);

  const updateRating = async (ratingType: RecipeRatingType) => {
    if (!session?.user) {
      return;
    }
    addRating({ recipeId: recipe.id, type: ratingType })
      .then(() => window.location.reload())
      .catch((error) => console.log(error));
  };

  const userHasRated = (ratingType: RecipeRatingType) =>
    recipe.ratings.some(
      (r) => r.author.id === Number(session?.user.id) && r.type === ratingType,
    );

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-row items-center">
      <Tooltip title="Share">
        <Button onClick={handleClick} startIcon={<Share color="secondary" />}>
          <Typography variant="body2">Share</Typography>
        </Button>
      </Tooltip>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Link copied to clipboard"
      />

      <Tooltip title="Like recipe">
        <Button
          id="like-button"
          disabled={session === null}
          onClick={() => updateRating("LIKE")}
          startIcon={
            <ThumbUpSharp
              color={userHasRated("LIKE") ? "secondary" : "primary"}
            />
          }
        >
          <Typography
            variant="overline"
            color="primary"
            data-testid="like-count"
          >
            {recipe.ratings.filter((rating) => rating.type === "LIKE").length}
          </Typography>
        </Button>
      </Tooltip>

      <Tooltip title="Dislike recipe">
        <Button
          id="dislike-button"
          onClick={() => updateRating("DISLIKE")}
          startIcon={
            <ThumbDown
              color={userHasRated("DISLIKE") ? "secondary" : "primary"}
            />
          }
        >
          <Typography
            variant="overline"
            color="primary"
            data-testid="dislike-count"
          >
            {
              recipe.ratings.filter((rating) => rating.type === "DISLIKE")
                .length
            }
          </Typography>
        </Button>
      </Tooltip>
    </div>
  );
};

export default LikeButtons;
