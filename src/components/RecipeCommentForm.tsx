"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createComment } from "@/actions/comments";

import type { Recipe } from "@prisma/client";

const CommentSchema = z.object({
  recipeId: z.number(),
  message: z.string().min(4).max(1000),
});

type CommentForm = z.infer<typeof CommentSchema>;

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
      message: '',
    },
    resolver: zodResolver(CommentSchema),
  });

  const handleFormSubmit = (data: any) => {    
    createComment(data)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log('ERROR = ', err);
      });
  };

  const handleErrors = (errors: any) => {
    console.log('ERRORS = ', errors);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
        {...register('message')}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit(handleFormSubmit, handleErrors)}
        >
          SEND COMMENT
        </Button>
      </div>
    </div>
  );
};

export default RecipeCommentForm;