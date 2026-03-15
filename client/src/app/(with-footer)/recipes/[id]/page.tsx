import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Rating,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import RecipeStatChip from "@/components/RecipeStatChip";
import { getSession } from "@/lib/actions/auth";
import { findRecipeById } from "@/lib/actions/recipe";
import { ROUTES } from "@/types";
import SearchIcon from "@mui/icons-material/Search";
import LikeButtons from "./components/LikeButtons";
import RecipeCommentForm from "./components/RecipeCommentForm";
import ShoppingListQRModal from "./components/ShoppingListQRModal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({ params }: Props) {
  const recipeId = (await params).id;
  const recipe = await findRecipeById(recipeId);

  if (!recipe) {
    return (
      <Container>
        <Typography variant="h4" className="py-20 text-center">
          Recipe not found
        </Typography>
      </Container>
    );
  }

  const session = await getSession();
  const likes = recipe.ratings.filter((r) => r.type === "LIKE").length;
  const dislikes = recipe.ratings.filter((r) => r.type === "DISLIKE").length;
  const averageRating = recipe.ratings.length > 0 ? (likes / (likes + dislikes)) * 5 : 0;
  const middleIndex = Math.ceil(recipe.ingredients.length / 2);
  const leftIngredients = recipe.ingredients.slice(0, middleIndex);
  const rightIngredients = recipe.ingredients.slice(middleIndex);

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="relative w-full bg-gray-900">
        {recipe.image && (
          <Box className="absolute inset-0">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover opacity-80"
              priority
            />
          </Box>
        )}
        {!recipe.image && (
          <Box className="absolute inset-0 flex items-center justify-center">
            <RestaurantIcon className="text-gray-600" style={{ fontSize: 120 }} />
          </Box>
        )}

        <Box className="relative bg-gradient-to-t from-black/80 to-transparent">
          <Container
            maxWidth="lg"
            className="flex min-h-[300px] flex-col justify-between gap-4 py-4 sm:min-h-[460px] sm:py-6"
          >
            <Box>
              <Link href={ROUTES.RECIPES}>
                <Button startIcon={<ArrowBackIcon />} variant="outlined" color="info" size="small">
                  Back to Recipes
                </Button>
              </Link>
            </Box>

            <Box className="flex flex-col gap-3 pb-2 sm:pb-4">
              {recipe.category && (
                <Chip
                  size="small"
                  label={recipe.category}
                  className="w-fit bg-orange-400 text-white"
                />
              )}
              <Typography
                variant="h3"
                color="text.primaryLight"
                className="drop-shadow-lg"
                fontWeight="bold"
              >
                {recipe.title}
              </Typography>
              <Typography variant="h6" color="text.secondaryLight">
                {recipe.description}
              </Typography>

              <Link href={`${ROUTES.PROFILES}/${recipe.author.id}`}>
                <Box className="flex flex-row items-center gap-2">
                  <Avatar className="size-8 bg-[rgb(255_255_255_/_0.20)] sm:size-12">
                    {recipe.author.username[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" color="text.secondaryLight">
                      Recipe by
                    </Typography>
                    <Typography variant="body1" color="text.primaryLight">
                      @{recipe.author.username}
                    </Typography>
                  </Box>
                </Box>
              </Link>

              <Box className="flex flex-wrap items-center gap-3">
                <RecipeStatChip icon={<AccessTimeIcon className="text-base" />}>
                  <Box className="flex items-center gap-1">
                    <Typography variant="body2" fontWeight="bold">
                      {recipe.cookingTime}
                    </Typography>
                    <Typography variant="caption" color="text.primaryLight">
                      min
                    </Typography>
                  </Box>
                </RecipeStatChip>
                <RecipeStatChip icon={<PeopleOutlineIcon className="text-base" />}>
                  <Box className="flex items-center gap-1">
                    <Typography variant="body2" fontWeight="bold">
                      {recipe.servings}
                    </Typography>
                    <Typography variant="caption" color="text.primaryLight">
                      servings
                    </Typography>
                  </Box>
                </RecipeStatChip>
                <Box className="flex items-center gap-2">
                  <Rating
                    value={averageRating}
                    readOnly
                    precision={0.1}
                    size="medium"
                    icon={<StarIcon fontSize="inherit" className="text-yellow-400" />}
                    emptyIcon={<StarIcon fontSize="inherit" className="text-gray-400" />}
                  />
                  <Typography variant="body1" color="text.primaryLight">
                    {averageRating.toFixed(1)} ({recipe.ratings.length})
                  </Typography>
                </Box>
              </Box>

              <LikeButtons recipe={recipe} session={session} />
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg" className="py-8">
        <Card className="mb-8 overflow-hidden rounded-2xl border border-gray-200">
          <CardContent className="p-4 sm:p-8">
            <Box className="mb-6 flex items-center justify-between gap-3">
              <Box className="flex items-center gap-3">
                <Box
                  className="flex size-10 items-center justify-center rounded-full "
                  sx={{ bgcolor: "primary.main" }}
                >
                  <RestaurantIcon className="text-white" fontSize="small" />
                </Box>
                <Typography variant="h5" color="text.primary">
                  Ingredients
                </Typography>
              </Box>
              {session && <ShoppingListQRModal recipeId={recipe.id} />}
            </Box>

            <Box className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
              <Box className="flex flex-col gap-2">
                {leftIngredients.map((ingredient, index) => (
                  <Box key={`left-${index}`} className="flex items-start gap-3">
                    <Box className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary-main" />
                    <Typography variant="body1" color="text.secondary">
                      {ingredient}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box className="flex flex-col gap-2">
                {rightIngredients.map((ingredient, index) => (
                  <Box key={`right-${index}`} className="flex items-start gap-3">
                    <Box className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary-main" />
                    <Typography variant="body1" color="text.secondary">
                      {ingredient}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8 overflow-hidden rounded-2xl border border-gray-200">
          <CardContent className="p-4 sm:p-8">
            <Box className="mb-6 flex items-center gap-3">
              <Box
                className="flex size-10 items-center justify-center rounded-full"
                sx={{ bgcolor: "primary.main" }}
              >
                <SearchIcon className="text-white" fontSize="small" />
              </Box>
              <Typography variant="h5" color="text.primary">
                Instructions
              </Typography>
            </Box>

            <Box className="flex flex-col gap-4">
              {recipe.instructions.split("\n").map((instruction, index) => (
                <Box key={index} className="flex items-center gap-4">
                  <Box>
                    <Typography variant="body2">{index + 1}.</Typography>
                  </Box>
                  <Typography variant="body1" className="pt-1" color="text.secondary">
                    {instruction}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <RecipeCommentForm recipe={recipe} />
      </Container>
    </Box>
  );
}
