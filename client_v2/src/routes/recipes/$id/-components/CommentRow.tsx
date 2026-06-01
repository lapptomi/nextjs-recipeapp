import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import type { RecipeComment } from "../../../../types/recipe";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2),
  alignItems: "flex-start",
}));

export default function CommentRow({ comment }: { comment: RecipeComment }) {
  return (
    <StyledListItem>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {comment.author.username[0].toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold" }}
              color="text.primary"
            >
              @{comment.author.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {comment.createdAt &&
                new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </Typography>
          </Box>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            {comment.message}
          </Typography>
        }
      />
    </StyledListItem>
  );
}
