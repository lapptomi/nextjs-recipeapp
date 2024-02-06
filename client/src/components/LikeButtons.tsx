/* eslint-disable no-null/no-null */
"use client";

import { Share, ThumbDown, ThumbUpSharp } from "@mui/icons-material";
import { Button, Tooltip, Typography } from "@mui/material";

import { addRating } from "@/lib/actions/recipe";

import type { Recipe, RecipeRatingType } from "@/types";
import type { Session } from "next-auth/core/types";

interface Props {
  recipe: Recipe;
  session: Session | null;
}

const LikeButtons = ({ recipe, session }: Props) => {  

  const updateRating = async (ratingType: RecipeRatingType) => {
    if (!session?.user) return;

    addRating({
      recipeId: recipe.id,
      type: ratingType,
    }).then(() => window.location.reload())
      .catch((error) => console.log(error));
  };

  const userHasRated = (ratingType: RecipeRatingType) => {
    return recipe.ratings.some((r) => (
      r.author.id === Number(session?.user.id) && r.type === ratingType
    ));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <Tooltip title="Share">
        <Button startIcon={<Share color="secondary" />}>
          <Typography variant="body2">Share</Typography>
        </Button>
      </Tooltip>

      <Tooltip title="Like recipe">
        <Button
          id="like-button"
          disabled={session === null}
          onClick={() => updateRating('LIKE')}
          startIcon={
            <ThumbUpSharp color={userHasRated('LIKE') ? 'secondary' : 'primary'}/>
          }
        >
          <Typography variant="overline" color="primary" className="like-count">
            {recipe.ratings.filter((rating) => rating.type === 'LIKE').length}
          </Typography>
        </Button>
      </Tooltip>

      <Tooltip title="Dislike recipe">
        <Button
          id="dislike-button"
          disabled={session === null}
          onClick={() => updateRating('DISLIKE')}
          startIcon={
            <ThumbDown color={userHasRated('DISLIKE') ? 'secondary' : 'primary'}/>
          }
        >
          <Typography variant="overline" color="primary" className="dislike-count">
            {recipe.ratings.filter((rating) => rating.type === 'DISLIKE').length}
          </Typography>
        </Button>   
      </Tooltip>
    </div>
  );
};

export default LikeButtons;