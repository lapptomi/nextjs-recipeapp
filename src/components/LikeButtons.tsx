"use client";

import { Share, ThumbDown, ThumbUpSharp } from "@mui/icons-material";
import { Button, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";

import type { RecipeIncludeRelations } from "@/types";
import type { RecipeRating, RecipeRatingType } from "@prisma/client";

interface Props {
  recipe: RecipeIncludeRelations;
}

const LikeButtons: React.FC<Props> = ({ recipe }) => {
  const session = useSession();

  const updateRating = async (ratingType: RecipeRatingType) => {
    axios.post(`/api/recipes/ratings`, {
      recipeId: recipe.id,
      authorId: session.data?.user.id,
      type: ratingType,
    }).then(() => window.location.reload())
      .catch((error) => console.log(error));
  };

  const userHasRated = (ratingType: string) => {
    return recipe.ratings.some((r: RecipeRating) => (
      r.authorId === Number(session.data?.user.id) && r.type === ratingType
    ));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <Tooltip title="Share">
        <Button startIcon={<Share />}>
          <Typography color="white" variant="body2">Share</Typography>
        </Button>
      </Tooltip>

      <Tooltip title="Like recipe">
        <Button
          disabled={!session.data?.user}
          onClick={() => updateRating('LIKE')}
          startIcon={
            <ThumbUpSharp color={userHasRated('LIKE') ? 'primary' : 'info'}/>
          }
        >
          <Typography color="white">
            {recipe.ratings.filter((rating) => rating.type === 'LIKE').length}
          </Typography>
        </Button>
      </Tooltip>

      <Tooltip title="Dislike recipe">
        <Button
          disabled={!session.data?.user}
          onClick={() => updateRating('DISLIKE')}
          startIcon={
            <ThumbDown color={userHasRated('DISLIKE') ? 'primary' : 'info'}/>
          }
        >
          <Typography color="white">
            {recipe.ratings.filter((rating) => rating.type === 'DISLIKE').length}
          </Typography>
        </Button>   
      </Tooltip>
    </div>
  );
};

export default LikeButtons;