/* eslint-disable no-null/no-null */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccessTime,
  Add,
  CloudUpload,
  Delete,
  Description,
  DiningRounded,
  Group,
  Title,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";

import { createRecipe } from "@/lib/actions/recipe";
import { NewRecipeSchema, ROUTES } from "@/types";

import type { NewRecipe } from "@/types";

const CreateRecipeForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<NewRecipe>({
    defaultValues: {
      title: "",
      description: "",
      ingredients: [{ ingredient: "Add ingredient..." }],
      instructions: "",
      cookingTime: 0,
      servings: 0,
      image: null,
    },
    resolver: zodResolver(NewRecipeSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "ingredients",
  });

  const selectedImage = watch("image");
  const router = useRouter();

  const handleFormSubmit = (data: NewRecipe) => {
    const formData = new FormData();

    formData.append(
      "recipe",
      JSON.stringify({
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        cookingTime: data.cookingTime,
        servings: data.servings,
        ingredients: data.ingredients.map(
          (ingredient) => ingredient.ingredient,
        ),
      }),
    );
    formData.append("image", selectedImage as any);

    createRecipe(formData)
      .then((recipe) => router.push(`${ROUTES.RECIPES}/${recipe.id}`))
      .catch((error) => console.log("ERROR = ", error));
  };

  return (
    <form
      className="flex h-full w-[70vw] flex-col items-center justify-center gap-5 border-2 border-gray-100 p-6"
      onSubmit={handleSubmit(handleFormSubmit, (error) =>
        console.log("ERROR = ", error),
      )}
    >
      <TextField
        required
        error={!!errors.title}
        helperText={errors.title?.message}
        fullWidth
        label="Recipe Title"
        size="small"
        placeholder="Title"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Title />
            </InputAdornment>
          ),
        }}
        {...register("title")}
      />
      <TextField
        fullWidth
        label="Description (optional)"
        size="small"
        placeholder="Description"
        error={!!errors.description}
        helperText={errors.description?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Description />
            </InputAdornment>
          ),
        }}
        {...register("description")}
      />

      <FormControl className="w-full">
        <Typography variant="overline">Ingredients</Typography>
        {fields.map((_item, index) => {
          const showError =
            errors.ingredients?.[index]?.ingredient?.message !== undefined &&
            errors.ingredients?.[index] !== undefined;
          return (
            <TextField
              sx={{ marginTop: 1 }}
              key={index}
              required
              error={showError}
              helperText={errors.ingredients?.[index]?.ingredient?.message}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DiningRounded />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => remove(index)}>
                      <Delete />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register(`ingredients.${index}.ingredient`)}
            />
          );
        })}
        <Button
          size="small"
          onClick={(event: any) => append({ ingredient: event.target.value })}
        >
          <Add color="primary" />
          <Typography variant="caption">ADD INGREDIENT</Typography>
        </Button>
      </FormControl>

      <TextField
        error={!!errors.instructions}
        helperText={errors.instructions?.message}
        required
        fullWidth
        label="Instructions"
        size="small"
        placeholder="Instructions"
        multiline
        minRows={6}
        {...register("instructions")}
      />

      <Box className="flex w-full justify-between">
        <TextField
          size="small"
          label="Cooking time (minutes)"
          placeholder="Title"
          type="number"
          defaultValue={0}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTime />
              </InputAdornment>
            ),
          }}
          {...register("cookingTime", { valueAsNumber: true })}
        />

        <TextField
          size="small"
          label="Servings"
          placeholder="Servings"
          type="number"
          defaultValue={0}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Group />
              </InputAdornment>
            ),
          }}
          {...register("servings", { valueAsNumber: true })}
        />
      </Box>

      <Box className="flex min-h-36 w-full flex-col items-center justify-center bg-gray-50 p-5">
        <Typography variant="caption" color="error">
          {errors.image && errors.image.message}
        </Typography>
        <Button component="label" startIcon={<CloudUpload color="secondary" />}>
          <Typography variant="subtitle1">Upload recipe image</Typography>
          <input
            type="file"
            hidden
            accept="image/png, image/jpeg"
            {...register("image")}
            onChange={(event: any) => setValue("image", event.target.files[0])}
          />
        </Button>
        {selectedImage && (
          <Box>
            <Image
              alt="recipe image"
              width={100}
              height={100}
              src={URL.createObjectURL(selectedImage as any)}
            />
            <IconButton size="large">
              <Delete
                onClick={() => {
                  setValue("image", null);
                  clearErrors("image");
                }}
              />
            </IconButton>
          </Box>
        )}
        <Typography variant="caption">
          {selectedImage && selectedImage.name}
        </Typography>
      </Box>

      {Object.keys(errors).length !== 0 && (
        <Alert severity="error">Please fill in all required fields</Alert>
      )}

      <Box>
        <Button color="error">Cancel</Button>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default CreateRecipeForm;
