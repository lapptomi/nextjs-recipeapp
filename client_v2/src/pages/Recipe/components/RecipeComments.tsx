import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import type { RecipeComment } from "../../../types";

const CommentItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2),
  alignItems: "flex-start",
}));

interface Props {
  comments: RecipeComment[];
}

export default function RecipeComments({ comments }: Props) {
  return (
    <Card sx={{ overflow: "hidden", borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }} color="text.primary">
          Comments
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1.5 }} color="text.secondary">
            Leave a Comment
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Share your experience with this recipe..."
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton color="primary" sx={{ alignSelf: "flex-end", mb: 0.5 }}>
                    <SendIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { bgcolor: "grey.50" } }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {comments.length > 0 ? (
          <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {comments.map((comment) => (
              <CommentItem key={comment.id}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {comment.author.username[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} color="text.primary">
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
              </CommentItem>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 1, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No comments yet. Be the first to share your thoughts!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
