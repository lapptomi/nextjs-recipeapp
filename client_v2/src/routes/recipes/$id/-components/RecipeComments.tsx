import { Card, CardContent, Divider, Typography } from "@mui/material";
import type { RecipeComment } from "../../../../types/recipe";
import CommentsList from "./CommentsList";
import CommentForm from "./CommentForm";

interface Props {
  recipeId: number;
  comments: RecipeComment[];
}

export default function RecipeComments({ recipeId, comments }: Props) {
  return (
    <Card
      sx={{
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }} color="text.primary">
          Comments
        </Typography>
        <CommentsList comments={comments} />
        <Divider sx={{ mb: 3 }} />
        <CommentForm recipeId={recipeId} />
      </CardContent>
    </Card>
  );
}
