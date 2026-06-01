import { useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutlined";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Box, Button, Chip, Snackbar, Typography, styled } from "@mui/material";
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
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [savedRecipeId, setSavedRecipeId] = useState<number | undefined>();
  const [generatedImage, setGeneratedImage] = useState<string | undefined>();
  const [actionError, setActionError] = useState<string | undefined>();
  const [showSnackbar, setShowSnackbar] = useState(false);

  function handleSaveRecipe() {
    setIsSaving(true);
    setActionError(undefined);

    apiClient
      .post("/recipes", {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        instructions: recipe.instructions.join("\n"),
        category: recipe.category,
      })
      .then((created) => {
        setSavedRecipeId(created.id);
        setShowSnackbar(true);
        onSave?.();
      })
      .catch((e) => setActionError(`Failed to save recipe: ${e.message}`))
      .finally(() => setIsSaving(false));
  }

  function handleGenerateImage() {
    setIsGeneratingImage(true);
    setActionError(undefined);

    apiClient
      .post("/openai/generate-recipe-image", {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
      })
      .then(({ imageBase64 }) =>
        setGeneratedImage(`data:image/png;base64,${imageBase64}`),
      )
      .catch((e) => setActionError(`Failed to generate image: ${e.message}`))
      .finally(() => setIsGeneratingImage(false));
  }

  return (
    <RecipeCardContainer>
      <RecipeHeroSection sx={{ bgcolor: "primary.main" }}>
        {generatedImage && (
          <RecipeHeroImage src={generatedImage} alt={recipe.title} />
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
              onClick={handleGenerateImage}
              loading={isGeneratingImage}
              startIcon={
                <AutoAwesomeIcon sx={{ fontSize: "12px !important" }} />
              }
            >
              {isGeneratingImage ? "Generating..." : "Generate image"}
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
          <Typography variant="caption" color="text.secondary">
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
            {actionError && (
              <Typography variant="caption" color="error">
                {actionError}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveRecipe}
                disabled={isSaving || Boolean(savedRecipeId)}
                loading={isSaving}
                startIcon={<BookmarkBorderIcon />}
              >
                {savedRecipeId ? "Saved" : "Save Recipe"}
              </Button>
              {savedRecipeId && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate({
                      to: "/recipes/$id",
                      params: { id: String(savedRecipeId) },
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
