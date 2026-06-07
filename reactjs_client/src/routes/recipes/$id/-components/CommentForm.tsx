import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../../contexts/AuthContext";
import { apiClient } from "../../../../lib/apiClient";

const CommentSchema = z.object({
  message: z.string().min(1).max(1000),
});

type CommentForm = z.infer<typeof CommentSchema>;

const NotSignedInBox = styled(Box)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  textAlign: "center",
}));

export default function CommentForm({ recipeId }: { recipeId: number }) {
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentForm>({
    defaultValues: { message: "" },
    resolver: zodResolver(CommentSchema),
  });

  const addComment = useMutation({
    mutationFn: (data: CommentForm) =>
      apiClient.post(`/recipes/${recipeId}/comments`, {
        message: data.message,
      }),
    onSuccess: () => {
      reset();
      router.invalidate();
    },
  });

  if (!user) {
    return (
      <NotSignedInBox>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Please{" "}
          <Link to="/auth/login" style={{ color: "inherit" }}>
            <Typography
              component="span"
              color="primary"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              sign in
            </Typography>
          </Link>{" "}
          to leave a comment
        </Typography>
      </NotSignedInBox>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1.5, color: "text.secondary" }}>
        Leave a Comment
      </Typography>
      <TextField
        {...register("message")}
        fullWidth
        multiline
        rows={4}
        placeholder="Share your experience with this recipe..."
        variant="outlined"
        error={!!errors.message}
        helperText={errors.message?.message}
        disabled={addComment.isPending}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  sx={{ alignSelf: "flex-end", mb: 0.5 }}
                  disabled={addComment.isPending}
                  onClick={handleSubmit((data) => addComment.mutate(data))}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ "& .MuiOutlinedInput-root": { bgcolor: "grey.50" } }}
      />
    </Box>
  );
}
