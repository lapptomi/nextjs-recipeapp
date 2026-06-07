import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Box, Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "../../../../contexts/AuthContext";
import { apiClient } from "../../../../lib/apiClient";
import type { Recipe } from "../../../../types/recipe";

interface Props {
  recipe: Recipe;
  likes: number;
  dislikes: number;
}

export default function RatingButtons({ recipe, likes, dislikes }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const ratingMutation = useMutation({
    mutationFn: (type: "LIKE" | "DISLIKE") =>
      apiClient.post(`/recipes/${recipe.id}/ratings`, { type }),
    onSuccess: () => router.invalidate(),
  });

  const userRating = recipe.ratings.find((r) => r.userId === user?.id);
  const hasLiked = userRating?.type === "LIKE";
  const hasDisliked = userRating?.type === "DISLIKE";

  return (
    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
      <Button
        startIcon={<ThumbUpIcon />}
        variant={hasLiked ? "contained" : "outlined"}
        color="info"
        size="small"
        disabled={!user || ratingMutation.isPending}
        onClick={() => ratingMutation.mutate("LIKE")}
      >
        {likes}
      </Button>
      <Button
        startIcon={<ThumbDownIcon />}
        variant={hasDisliked ? "contained" : "outlined"}
        color="info"
        size="small"
        disabled={!user || ratingMutation.isPending}
        onClick={() => ratingMutation.mutate("DISLIKE")}
      >
        {dislikes}
      </Button>
    </Box>
  );
}
