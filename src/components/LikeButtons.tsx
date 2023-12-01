"use client";

import { Share, ThumbUpSharp } from "@mui/icons-material";
import { Button, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";

import type { RecipeRating } from "@prisma/client";

const LikeButtons = ({ recipe }: any) => {
  const session = useSession();

  const updateRating = async (ratingType: 'LIKE' | 'DISLIKE') => {
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
            {recipe.ratings.filter((rating: any) => rating.type === 'LIKE').length}
          </Typography>
        </Button>
      </Tooltip>

      <Tooltip title="Dislike recipe">
        <Button
          disabled={!session.data?.user}
          onClick={() => updateRating('DISLIKE')}
          startIcon={
            <ThumbUpSharp color={userHasRated('DISLIKE') ? 'primary' : 'info'}/>
          }
        >
          <Typography color="white">
            {recipe.ratings.filter((rating: any) => rating.type === 'DISLIKE').length}
          </Typography>
        </Button>   
      </Tooltip>
    </div>
  );
};

export default LikeButtons;