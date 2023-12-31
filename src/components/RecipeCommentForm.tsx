"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const handleFormSubmit = (data: CommentForm) => {
    axios.post('/api/recipes/comments', data)
      .then(() => window.location.reload())
      .catch((error) => console.log('ERROR = ', error));  
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
          onClick={handleSubmit(handleFormSubmit, (error) => console.log(error))}
        >
          SEND COMMENT
        </Button>
      </div>
    </div>
  );
};

export default RecipeCommentForm;