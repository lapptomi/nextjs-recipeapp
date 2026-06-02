import { Box, List, Typography } from "@mui/material";
import type { RecipeComment } from "../../../../types/recipe";
import CommentRow from "./CommentRow";

export default function CommentsList({
  comments,
}: {
  comments: RecipeComment[];
}) {
  if (comments.length === 0) {
    return (
      <Box sx={{ py: 1, textAlign: "center", mb: 3 }}>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          No comments yet. Be the first to share your thoughts!
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
      {comments.map((comment) => (
        <CommentRow key={comment.id} comment={comment} />
      ))}
    </List>
  );
}
