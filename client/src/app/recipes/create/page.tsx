"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  MenuItem,
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { createRecipe } from "@/lib/actions/recipe";
import { ROUTES } from "@/types";

interface Ingredient {
  amount: string;
  unit: string;
  name: string;
}

const CreateRecipePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { amount: "", unit: "", name: "" },
  ]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState("");

  const addIngredient = () => {
    setIngredients([...ingredients, { amount: "", unit: "", name: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addStep = () => {
    setInstructions([...instructions, ""]);
  };

  const removeStep = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!title || !description || !cookTime || !servings) {
      setError("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    const ingredientsList = ingredients
      .filter((ing) => ing.name.trim() !== "")
      .map((ing) => `${ing.amount} ${ing.unit} ${ing.name}`.trim());

    const instructionsText = instructions
      .filter((step) => step.trim() !== "")
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n");

    formData.append(
      "recipe",
      JSON.stringify({
        title,
        description,
        instructions: instructionsText,
        cookingTime: parseInt(cookTime) + parseInt(prepTime || "0"),
        servings: parseInt(servings),
        ingredients: ingredientsList,
      })
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      const recipe = await createRecipe(formData);
      router.push(`${ROUTES.RECIPES}/${recipe.id}`);
    } catch (err) {
      setError("Failed to create recipe. Please try again.");
      console.error(err);
    }
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Link href={ROUTES.RECIPES}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 3,
              color: "text.primary",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            Back to Recipes
          </Button>
        </Link>

        <Box className="mb-8 flex items-center gap-3">
          <Box
            className="flex size-10 items-center justify-center rounded-lg"
            sx={{ bgcolor: "#fef3c6" }}
          >
            <SoupKitchenOutlinedIcon sx={{ color: "primary.main", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" className="font-bold" sx={{ color: "text.primary" }}>
              Create New Recipe
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Share your culinary creation with the community
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Card className="mb-8" sx={{ borderRadius: 3.5, boxShadow: 2 }}>
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center gap-3">
              <Box className="h-5 w-1 rounded-full" sx={{ bgcolor: "primary.main" }} />
              <Typography variant="h6" className="font-semibold" sx={{ color: "text.primary" }}>
                Basic Information
              </Typography>
            </Box>

            <Box className="flex flex-col gap-5">
              <Box>
                <Typography variant="body2" className="mb-2 font-medium" sx={{ color: "#404040" }}>
                  Recipe Title *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Grandma's Secret Chocolate Chip Cookies"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f3f3f5",
                      "& fieldset": { borderColor: "#d4d4d4" },
                      "&:hover fieldset": { borderColor: "#d4d4d4" },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" className="mb-2 font-medium" sx={{ color: "#404040" }}>
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Brief description of your recipe... What makes it special?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f3f3f5",
                      "& fieldset": { borderColor: "#d4d4d4" },
                      "&:hover fieldset": { borderColor: "#d4d4d4" },
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: "#737373" }}>
                  {description.length}/500 characters
                </Typography>
              </Box>

              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography
                    variant="body2"
                    className="mb-2 font-medium"
                    sx={{ color: "#404040" }}
                  >
                    Category *
                  </Typography>
                  <Select
                    fullWidth
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    sx={{
                      bgcolor: "#f3f3f5",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d4d4d4" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d4d4d4" },
                    }}
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
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    className="mb-2 font-medium"
                    sx={{ color: "#404040" }}
                  >
                    Difficulty Level *
                  </Typography>
                  <Select
                    fullWidth
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    displayEmpty
                    sx={{
                      bgcolor: "#f3f3f5",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d4d4d4" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d4d4d4" },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select difficulty
                    </MenuItem>
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8" sx={{ borderRadius: 3.5, boxShadow: 2 }}>
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center gap-3">
              <Box className="h-5 w-1 rounded-full" sx={{ bgcolor: "primary.main" }} />
              <Typography variant="h6" className="font-semibold" sx={{ color: "text.primary" }}>
                Recipe Details
              </Typography>
            </Box>

            <Box className="grid grid-cols-3 gap-4">
              <Box>
                <Box className="mb-2 flex items-center gap-2">
                  <AccessTimeIcon sx={{ fontSize: 16, color: "#404040" }} />
                  <Typography variant="body2" className="font-medium" sx={{ color: "#404040" }}>
                    Prep Time (min) *
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="15"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f3f3f5",
                      "& fieldset": { borderColor: "#d4d4d4" },
                      "&:hover fieldset": { borderColor: "#d4d4d4" },
                    },
                  }}
                />
              </Box>

              <Box>
                <Box className="mb-2 flex items-center gap-2">
                  <AccessTimeIcon sx={{ fontSize: 16, color: "#404040" }} />
                  <Typography variant="body2" className="font-medium" sx={{ color: "#404040" }}>
                    Cook Time (min) *
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="30"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f3f3f5",
                      "& fieldset": { borderColor: "#d4d4d4" },
                      "&:hover fieldset": { borderColor: "#d4d4d4" },
                    },
                  }}
                />
              </Box>

              <Box>
                <Box className="mb-2 flex items-center gap-2">
                  <RestaurantMenuIcon sx={{ fontSize: 16, color: "#404040" }} />
                  <Typography variant="body2" className="font-medium" sx={{ color: "#404040" }}>
                    Servings *
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="4"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f3f3f5",
                      "& fieldset": { borderColor: "#d4d4d4" },
                      "&:hover fieldset": { borderColor: "#d4d4d4" },
                    },
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8" sx={{ borderRadius: 3.5, boxShadow: 2 }}>
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Box className="h-5 w-1 rounded-full" sx={{ bgcolor: "primary.main" }} />
                <Typography variant="h6" className="font-semibold" sx={{ color: "text.primary" }}>
                  Ingredients
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {ingredients.length} item{ingredients.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            <Box className="flex flex-col gap-3">
              {ingredients.map((ingredient, index) => (
                <Box key={index} className="flex items-center gap-2">
                  <Box
                    className="flex size-6 shrink-0 items-center justify-center rounded bg-gray-100"
                    sx={{ color: "text.secondary" }}
                  >
                    <Typography variant="caption" className="font-medium">
                      {index + 1}
                    </Typography>
                  </Box>
                  <TextField
                    size="small"
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                    sx={{
                      width: "80px",
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#f3f3f5",
                        "& fieldset": { borderColor: "#d4d4d4" },
                      },
                    }}
                  />
                  <Select
                    size="small"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                    displayEmpty
                    sx={{
                      width: "100px",
                      bgcolor: "#f3f3f5",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d4d4d4" },
                    }}
                  >
                    <MenuItem value="">Unit</MenuItem>
                    <MenuItem value="cup">cup</MenuItem>
                    <MenuItem value="tbsp">tbsp</MenuItem>
                    <MenuItem value="tsp">tsp</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="ml">ml</MenuItem>
                    <MenuItem value="oz">oz</MenuItem>
                    <MenuItem value="lb">lb</MenuItem>
                    <MenuItem value="piece">piece</MenuItem>
                  </Select>
                  <TextField
                    size="small"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, "name", e.target.value)}
                    className="flex-1"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#f3f3f5",
                        "& fieldset": { borderColor: "#d4d4d4" },
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addIngredient}
                sx={{
                  color: "text.secondary",
                  justifyContent: "center",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                Add Ingredient
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8" sx={{ borderRadius: 3.5, boxShadow: 2 }}>
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Box className="h-5 w-1 rounded-full" sx={{ bgcolor: "primary.main" }} />
                <Typography variant="h6" className="font-semibold" sx={{ color: "text.primary" }}>
                  Instructions
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {instructions.length} step{instructions.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            <Box className="flex flex-col gap-3">
              {instructions.map((step, index) => (
                <Box key={index} className="flex items-start gap-3">
                  <Box
                    className="flex size-8 shrink-0 items-center justify-center rounded-full"
                    sx={{ bgcolor: "#fef3c6" }}
                  >
                    <Typography
                      variant="body2"
                      className="font-semibold"
                      sx={{ color: "primary.main" }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder={`Step ${index + 1}: Describe this step in detail...`}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#f3f3f5",
                        "& fieldset": { borderColor: "#d4d4d4" },
                        "&:hover fieldset": { borderColor: "#d4d4d4" },
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeStep(index)}
                    disabled={instructions.length === 1}
                    sx={{ mt: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addStep}
                sx={{
                  color: "text.secondary",
                  justifyContent: "center",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                Add Step
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8" sx={{ borderRadius: 3.5, boxShadow: 2 }}>
          <CardContent className="p-6">
            <Box className="mb-6 flex items-center gap-3">
              <Box className="h-5 w-1 rounded-full" sx={{ bgcolor: "primary.main" }} />
              <Typography variant="h6" className="font-semibold" sx={{ color: "text.primary" }}>
                Recipe Photo
              </Typography>
            </Box>

            <Box
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12"
              sx={{ borderColor: "#e5e5e5", bgcolor: "#fafafa" }}
            >
              {imagePreview ? (
                <Box className="relative">
                  <Image
                    src={imagePreview}
                    alt="Recipe preview"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      setImage(null);
                      setImagePreview("");
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "white",
                      "&:hover": { bgcolor: "grey.100" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                  <Typography variant="body1" className="mb-1" sx={{ color: "text.primary" }}>
                    Click to upload recipe photo
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    PNG, JPG or WEBP (max. 10MB)
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="recipe-image-upload"
                  />
                  <label htmlFor="recipe-image-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      sx={{
                        mt: 2,
                        borderColor: "#d4d4d4",
                        color: "text.primary",
                        "&:hover": { borderColor: "#d4d4d4", bgcolor: "grey.50" },
                      }}
                    >
                      Choose File
                    </Button>
                  </label>
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box className="flex justify-end gap-3">
          <Button
            variant="outlined"
            onClick={() => router.push(ROUTES.RECIPES)}
            sx={{
              borderColor: "#d4d4d4",
              color: "text.primary",
              "&:hover": { borderColor: "#d4d4d4", bgcolor: "grey.50" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Publish Recipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateRecipePage;
