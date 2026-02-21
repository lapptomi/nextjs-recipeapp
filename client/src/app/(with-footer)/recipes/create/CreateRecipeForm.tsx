"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { createRecipe } from "@/lib/actions/recipe";
import { NewRecipe, NewRecipeSchema, ROUTES } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

const recipeOutlinedInputSx = {
  bgcolor: "grey.100",
  "& fieldset": { borderColor: "grey.300" },
  "&:hover fieldset": { borderColor: "grey.300" },
};

const recipeFieldSlotProps = {
  input: {
    sx: recipeOutlinedInputSx,
  },
};

export default function CreateRecipeForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { isSubmitting },
  } = useForm<NewRecipe>({
    defaultValues: {
      title: "",
      description: "",
      ingredients: [{ ingredient: "", amount: "" }],
      instructions: [{ instruction: "", step: 1 }],
      cookingTime: 0,
      servings: 0,
      image: null,
      category: "",
    },
    resolver: zodResolver(NewRecipeSchema),
  });

  const {
    fields: ingredientsFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: control,
    name: "ingredients",
  });

  const {
    fields: instructionsFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: control,
    name: "instructions",
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
        instructions: data.instructions.map((instruction) => instruction.instruction).join("\n"),
        cookingTime: data.cookingTime,
        servings: data.servings,
        ingredients: data.ingredients.map(
          (ingredient) => `${ingredient.amount} ${ingredient.ingredient}`
        ),
        category: data.category,
      })
    );
    formData.append("image", selectedImage as any);

    createRecipe(formData)
      .then((recipe) => router.push(`${ROUTES.RECIPES}/${recipe.id}`))
      .catch((error) => console.log("ERROR = ", error));
  };

  return (
    <Box className="bg-gray-50 min-h-screen py-4">
      <Container maxWidth="md">
        <Link href={ROUTES.RECIPES}>
          <Button startIcon={<ArrowBackIcon />}>Back to Recipes</Button>
        </Link>

        <Box className="mb-8 flex items-center gap-3">
          <Box className="flex size-10 items-center justify-center rounded-lg">
            <SoupKitchenOutlinedIcon color="primary" fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" className="font-bold" color="text.primary">
              Create New Recipe
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Share your culinary creation with the community
            </Typography>
          </Box>
        </Box>

        {errors.title && (
          <Alert severity="error" className="mb-4">
            {errors.title?.message}
          </Alert>
        )}

        <Card className="mb-8 rounded-[14px] shadow-md">
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center gap-3">
              <Box className="h-5 w-1 rounded-full" />
              <Typography variant="h6" className="font-semibold" color="text.primary">
                Basic Information
              </Typography>
            </Box>

            <Box className="flex flex-col gap-5">
              <Box>
                <Typography variant="body2" className="mb-2 font-medium" color="text.primary">
                  Recipe Title *
                </Typography>
                <TextField
                  {...register("title")}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  placeholder="e.g., Grandma's Secret Chocolate Chip Cookies"
                  slotProps={recipeFieldSlotProps}
                />
              </Box>

              <Box>
                <Typography variant="body2" className="mb-2 font-medium" color="text.primary">
                  Description
                </Typography>
                <TextField
                  {...register("description")}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Brief description of your recipe... What makes it special?"
                  slotProps={recipeFieldSlotProps}
                />
                <Typography variant="caption" color="text.secondary">
                  {watch("description")?.length}/500 characters
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8 rounded-[14px] shadow-md">
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center gap-3">
              <Box className="h-5 w-1 rounded-full bg-orange-600" />
              <Typography variant="h6" className="font-semibold" color="text.primary">
                Recipe Details
              </Typography>
            </Box>

            <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Box>
                <Box className="mb-2 flex items-center gap-2">
                  <AccessTimeIcon className="text-base text-neutral-700" />
                  <Typography variant="body2" color="text.secondary">
                    Cooking Time (minutes)
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="30"
                  {...register("cookingTime", { valueAsNumber: true })}
                  slotProps={recipeFieldSlotProps}
                />
              </Box>

              <Box>
                <Box className="mb-2 flex items-center gap-2">
                  <RestaurantMenuIcon className="text-base text-neutral-700" />
                  <Typography variant="body2" className="font-medium" color="text.secondary">
                    Servings
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="4"
                  {...register("servings", { valueAsNumber: true })}
                  slotProps={recipeFieldSlotProps}
                />
              </Box>

              <Box>
                <Typography variant="body2" className="mb-2 font-medium" color="text.primary">
                  Category
                </Typography>
                <Select
                  {...register("category")}
                  error={!!errors.category}
                  fullWidth
                  displayEmpty
                  input={<OutlinedInput sx={recipeOutlinedInputSx} />}
                >
                  <MenuItem value="" disabled>
                    Select category
                  </MenuItem>
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                  <MenuItem value="dinner">Dinner</MenuItem>
                  <MenuItem value="dessert">Dessert</MenuItem>
                  <MenuItem value="snack">Snack</MenuItem>
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category.message}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8 rounded-[14px] shadow-md">
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Box className="h-5 w-1 rounded-full bg-orange-600" />
                <Typography variant="h6" className="font-semibold" color="text.primary">
                  Ingredients
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {ingredientsFields.length} item{ingredientsFields.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            <Box className="flex flex-col gap-3">
              {ingredientsFields.map((_, index) => (
                <Box key={index} className="flex items-center gap-2">
                  <Box className="flex size-6 shrink-0 items-center justify-center rounded bg-gray-100">
                    <Typography variant="caption" className="font-medium">
                      {index + 1}
                    </Typography>
                  </Box>

                  <TextField
                    {...register(`ingredients.${index}.amount`)}
                    error={!!errors.ingredients?.[index]?.amount}
                    size="small"
                    placeholder="Amount"
                    className="w-20"
                    slotProps={recipeFieldSlotProps}
                  />

                  <TextField
                    {...register(`ingredients.${index}.ingredient`)}
                    error={!!errors.ingredients?.[index]?.ingredient}
                    size="small"
                    placeholder="Ingredient name"
                    className="flex-1"
                    slotProps={recipeFieldSlotProps}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredientsFields.length === 1}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                color="secondary"
                onClick={() => {
                  const ingredients = watch("ingredients");
                  const index = ingredients.length - 1;

                  const amount = ingredients[index]?.amount?.trim();
                  const ingredient = ingredients[index]?.ingredient?.trim();

                  if (!ingredient || !amount) {
                    if (!ingredient) {
                      setError(`ingredients.${index}.ingredient`, {
                        type: "manual",
                        message: "Ingredient cannot be empty",
                      });
                    }
                    if (!amount) {
                      setError(`ingredients.${index}.amount`, {
                        type: "manual",
                        message: "Amount cannot be empty",
                      });
                    }
                    return;
                  }

                  clearErrors([`ingredients.${index}`]);

                  appendIngredient({
                    ingredient: "",
                    amount: "",
                  });
                }}
              >
                Add Ingredient
              </Button>
              {errors.ingredients && (
                <Typography variant="caption" color="error">
                  Amount or ingredient cannot be empty
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8 rounded-[14px] shadow-md">
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Box className="h-5 w-1 rounded-full bg-orange-600" />
                <Typography variant="h6" className="font-semibold" color="text.primary">
                  Instructions
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {instructionsFields.length} step{instructionsFields.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            <Box className="flex flex-col gap-3">
              {instructionsFields.map((_, index) => (
                <Box key={index} className="flex items-start gap-3">
                  <Box className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <Typography variant="body2" className="font-semibold text-orange-600">
                      {index + 1}
                    </Typography>
                  </Box>
                  <TextField
                    error={!!errors.instructions?.[index]?.instruction}
                    helperText={errors.instructions?.[index]?.instruction?.message}
                    {...register(`instructions.${index}.instruction`, { required: true })}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder={`Step ${index + 1}: Describe this step in detail...`}
                    slotProps={recipeFieldSlotProps}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeInstruction(index)}
                    disabled={instructionsFields.length === 1}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                color="secondary"
                onClick={() => {
                  const instructions = watch("instructions");
                  const index = instructions.length - 1;

                  if (!instructions[index]?.instruction?.trim()) {
                    setError(`instructions.${index}.instruction`, {
                      type: "manual",
                      message: "Instruction cannot be empty",
                    });
                    return;
                  } else {
                    clearErrors(`instructions.${index}.instruction`);
                  }

                  appendInstruction({
                    instruction: "",
                    step: instructions.length + 1,
                  });
                }}
              >
                Add Step
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8 rounded-[14px] shadow-md">
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center gap-3">
              <Box className="h-5 w-1 rounded-full" />
              <Typography variant="h6" className="font-semibold" color="text.primary">
                Recipe Photo
              </Typography>
            </Box>

            <Box className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-12">
              <Typography variant="caption" color="error">
                {errors.image && errors.image.message}
              </Typography>
              {selectedImage ? (
                <Box className="relative flex flex-col">
                  <Typography variant="body1" color="text.secondary">
                    {selectedImage && selectedImage.name}
                  </Typography>
                  <Image
                    src={URL.createObjectURL(selectedImage as any)}
                    alt="Recipe preview"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />

                  <Box className="flex items-center">
                    <IconButton
                      size="large"
                      onClick={() => {
                        setValue("image", null);
                        clearErrors("image");
                      }}
                    >
                      <CloseIcon color="error" fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="error">
                      Remove image
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  <CloudUploadOutlinedIcon className="mb-2 text-5xl text-gray-500" />
                  <Typography variant="body1" color="text.primary">
                    Click to upload recipe photo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG or WEBP (max. 1MB)
                  </Typography>

                  <Button component="label" variant="text" color="primary">
                    <input
                      {...register("image")}
                      type="file"
                      hidden
                      accept="image/png, image/jpeg"
                      onChange={(event: any) => setValue("image", event.target.files[0])}
                    />
                    <Typography variant="subtitle1" color="primary">
                      Choose File
                    </Typography>
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box className="flex justify-end gap-3">
          <Button variant="outlined" onClick={() => router.push(ROUTES.RECIPES)} color="secondary">
            Cancel
          </Button>
          <Button
            loading={isSubmitting}
            variant="contained"
            color="primary"
            onClick={handleSubmit(handleFormSubmit, (error) => console.log("ERROR = ", error))}
            disabled={isSubmitting}
          >
            Publish Recipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
