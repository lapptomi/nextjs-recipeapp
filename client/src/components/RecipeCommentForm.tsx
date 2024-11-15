"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

import { addComment } from "@/lib/actions/recipe";
import { CommentSchema } from "@/types";

import type { CommentForm, Recipe } from "@/types";

interface Props {
  recipe: Recipe;
}

const RecipeCommentForm: React.FC<Props> = ({ recipe }) => {
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

  const handleFormSubmit = (data: CommentForm) => {
    addComment(data)
      .then(() => window.location.reload())
      .catch((error) => console.log("ERROR = ", error));
  };

  return (
    <div className="flex flex-col gap-2">
      <TextField
        error={!!errors.message}
        helperText={errors.message?.message}
        required
        fullWidth
        label="Add comment"
        size="small"
        placeholder="Add comment"
        multiline
        minRows={6}
        {...register("message")}
      />
      <div className="flex justify-end">
        <Button
          id="comment-button"
          size="small"
          variant="contained"
          onClick={handleSubmit(handleFormSubmit, (error) =>
            console.log(error),
          )}
        >
          SEND COMMENT
        </Button>
      </div>
    </div>
  );
};

export default RecipeCommentForm;
