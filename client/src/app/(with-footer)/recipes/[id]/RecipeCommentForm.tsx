"use client";

import { CommentForm, CommentSchema, Recipe, ROUTES } from "@/types";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { addComment } from "@/lib/actions/recipe";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "@mui/icons-material";

export default function RecipeCommentForm({ recipe }: { recipe: Recipe }) {
  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentForm>({
    defaultValues: {
      recipeId: recipe.id,
      message: "",
    },
    resolver: zodResolver(CommentSchema),
  });

  const onSubmit: SubmitHandler<CommentForm> = (data) =>
    addComment(data)
      .then(() => window.location.reload())
      .catch((error) => console.log("ERROR = ", error.message));

  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-200">
      <CardContent className="p-8">
        <Typography variant="h5" className="mb-6" color="text.primary" fontWeight="medium">
          Comments
        </Typography>

        {session.data?.user ? (
          <Box className="mb-8">
            <Typography
              variant="subtitle1"
              className="mb-3"
              color="text.secondary"
              fontWeight="medium"
            >
              Leave a Comment
            </Typography>
            <TextField
              {...register("message")}
              fullWidth
              multiline
              error={!!errors.message}
              helperText={errors.message?.message}
              rows={4}
              placeholder="Share your experience with this recipe..."
              variant="outlined"
              className="mb-3"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "grey.50",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "grey.400",
                  },
                },
              }}
            />
            <Button
              size="small"
              startIcon={<Send fontSize="small" />}
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Send
            </Button>
          </Box>
        ) : (
          <Box className="mb-8 rounded-lg bg-gray-100 p-4 text-center">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Please{" "}
              <Link href={ROUTES.LOGIN} className="underline">
                <Typography component="span" color="primary" className="hover:underline">
                  sign in
                </Typography>
              </Link>{" "}
              to leave a comment
            </Typography>
          </Box>
        )}

        <Divider className="mb-6" />

        {recipe.comments.length > 0 ? (
          <List className="flex flex-col gap-4">
            {recipe.comments.map((comment, index) => (
              <ListItem key={index} className="rounded-lg bg-gray-50 p-4" alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {comment.author.username[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box className="mb-2 flex items-center gap-2">
                      <Link href={`${ROUTES.PROFILES}/${comment.author.id}`}>
                        <Typography
                          variant="subtitle2"
                          className="font-semibold hover:underline"
                          sx={{ color: "text.primary" }}
                        >
                          @{comment.author.username}
                        </Typography>
                      </Link>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
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
              </ListItem>
            ))}
          </List>
        ) : (
          <Box className="py-1 text-center">
            <Typography variant="body1" color="text.secondary" fontWeight="medium">
              No comments yet. Be the first to share your thoughts!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
