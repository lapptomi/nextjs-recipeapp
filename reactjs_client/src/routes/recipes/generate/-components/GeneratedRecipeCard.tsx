import { useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutlined";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Box, Button, Chip, Snackbar, Typography, styled } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { apiClient } from "../../../../lib/apiClient";
import type { GeneratedRecipe } from "../../../../types/generate";
import GeneratedRecipeIngredients from "./GeneratedRecipeIngredients";
import GeneratedRecipeInstructions from "./GeneratedRecipeInstructions";

const RecipeCardContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  borderRadius: Number(theme.shape.borderRadius) * 3,
  boxShadow: theme.shadows[3],
  backgroundColor: "white",
}));

const RecipeHeroSection = styled(Box)({
  position: "relative",
  minHeight: 180,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: "transparent",
});

const RecipeHeroImage = styled("img")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const RecipeHeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flex: 1,
  padding: theme.spacing(2.5),
  gap: theme.spacing(1.5),
}));

const GenerateImageButton = styled(Button)(({ theme }) => ({
  borderRadius: 99,
  border: "1px solid rgba(255,255,255,0.25)",
  backgroundColor: "rgba(255,255,255,0.15)",
  color: "white",
  backdropFilter: "blur(4px)",
  textTransform: "none",
  fontSize: 12,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
}));

const StatBadge = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.2)",
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  backdropFilter: "blur(4px)",
  color: "white",
}));

const RecipeCardBody = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: theme.spacing(1),
}));

interface Props {
  recipe: GeneratedRecipe;
  onAdjust: (adjustment: string) => void;
  onSave?: () => void;
}

export default function GeneratedRecipeCard({
  recipe,
  onAdjust,
  onSave,
}: Props) {
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const saveRecipeMutation = useMutation<{ id: number }, Error>({
    mutationFn: () =>
      apiClient.post("/recipes", {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        instructions: recipe.instructions.join("\n"),
        category: recipe.category,
      }),
    onSuccess: () => {
      setShowSnackbar(true);
      onSave?.();
    },
  });

  const generateImageMutation = useMutation<{ imageBase64: string }, Error>({
    mutationFn: () =>
      apiClient.post("/openai/generate-recipe-image", {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
      }),
  });

  return (
    <RecipeCardContainer>
      <RecipeHeroSection sx={{ bgcolor: "primary.main" }}>
        {generateImageMutation.data && (
          <RecipeHeroImage
            src={`data:image/png;base64,${generateImageMutation.data.imageBase64}`}
            alt={recipe.title}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
          }}
        />
        <RecipeHeroContent>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <GenerateImageButton
              size="small"
              onClick={() => generateImageMutation.mutate()}
              loading={generateImageMutation.isPending}
              startIcon={
                <AutoAwesomeIcon sx={{ fontSize: "12px !important" }} />
              }
            >
              {generateImageMutation.isPending ? "Generating..." : "Generate image"}
            </GenerateImageButton>
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              {recipe.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              {recipe.description}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {[
              {
                icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
                label: `${recipe.cookingTime} min`,
              },
              {
                icon: <PeopleOutlineIcon sx={{ fontSize: 16 }} />,
                label: `${recipe.servings} servings`,
              },
              {
                icon: <WhatshotIcon sx={{ fontSize: 16 }} />,
                label: recipe.difficulty,
              },
            ].map(({ icon, label }) => (
              <StatBadge key={label}>
                {icon}
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {label}
                </Typography>
              </StatBadge>
            ))}
          </Box>
        </RecipeHeroContent>
      </RecipeHeroSection>

      <RecipeCardBody>
        <GeneratedRecipeIngredients ingredients={recipe.ingredients} />
        <GeneratedRecipeInstructions instructions={recipe.instructions} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            QUICK ADJUST
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {recipe.adjustments.map((adj) => (
              <Chip
                key={adj}
                label={adj}
                variant="outlined"
                onClick={() => onAdjust(adj)}
              />
            ))}
          </Box>

          <ActionButtons>
            {saveRecipeMutation.error && (
              <Typography variant="caption" color="error">
                Failed to save recipe: {saveRecipeMutation.error.message}
              </Typography>
            )}
            {generateImageMutation.error && (
              <Typography variant="caption" color="error">
                Failed to generate image: {generateImageMutation.error.message}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => saveRecipeMutation.mutate()}
                disabled={saveRecipeMutation.isPending || Boolean(saveRecipeMutation.data?.id)}
                loading={saveRecipeMutation.isPending}
                startIcon={<BookmarkBorderIcon />}
              >
                {saveRecipeMutation.data ? "Saved" : "Save Recipe"}
              </Button>
              {saveRecipeMutation.data && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate({
                      to: "/recipes/$id",
                      params: { id: String(saveRecipeMutation.data.id) },
                    })
                  }
                >
                  Open Recipe
                </Button>
              )}
            </Box>
          </ActionButtons>
        </Box>
      </RecipeCardBody>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") setShowSnackbar(false);
        }}
        message="Recipe saved successfully!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </RecipeCardContainer>
  );
}
