import { Link, useNavigate } from "@tanstack/react-router";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../lib/apiClient";
import { NewRecipeSchema, type NewRecipe } from "../../../types/recipe";
import { BasicInfoSection } from "./-components/BasicInfoSection";
import { RecipeDetailsSection } from "./-components/RecipeDetailsSection";
import { IngredientsSection } from "./-components/IngredientsSection";
import { InstructionsSection } from "./-components/InstructionsSection";
import { RecipePhotoSection } from "./-components/RecipePhotoSection";

export default function CreateRecipePage() {
  const navigate = useNavigate();

  const methods = useForm<NewRecipe>({
    defaultValues: {
      title: "",
      description: "",
      ingredients: [{ ingredient: "", amount: "" }],
      instructions: [{ instruction: "", step: 1 }],
      cookingTime: 0,
      servings: 0,
      category: "",
      image: null,
    },
    resolver: zodResolver(NewRecipeSchema),
  });

  const createRecipe = useMutation({
    mutationFn: async (data: NewRecipe) => {
      const recipe = await apiClient.post("/recipes", {
        title: data.title,
        description: data.description ?? "",
        instructions: data.instructions.map((i) => i.instruction).join("\n"),
        cookingTime: data.cookingTime ?? 0,
        servings: data.servings ?? 0,
        ingredients: data.ingredients.map((i) => `${i.amount} ${i.ingredient}`),
        category: data.category || undefined,
      });

      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append("image", data.image);
        await apiClient.postFormData(`/recipes/${recipe.id}/image`, formData);
      }

      return recipe;
    },
    onSuccess: (recipe) =>
      navigate({ to: "/recipes/$id", params: { id: String(recipe.id) } }),
  });

  const isPending = methods.formState.isSubmitting || createRecipe.isPending;

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Button
          component={Link}
          to="/recipes"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Recipes
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <SoupKitchenOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold" }}
              color="text.primary"
            >
              Create New Recipe
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Share your culinary creation with the community
            </Typography>
          </Box>
        </Box>

        {createRecipe.isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {createRecipe.error.message}
          </Alert>
        )}

        <FormProvider {...methods}>
          <BasicInfoSection />
          <RecipeDetailsSection />
          <IngredientsSection />
          <InstructionsSection />
          <RecipePhotoSection />
        </FormProvider>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="/recipes"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            loading={isPending}
            disabled={isPending}
            onClick={methods.handleSubmit(
              (data) => createRecipe.mutate(data),
              (err) => console.log("validation errors", err),
            )}
          >
            Publish Recipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
