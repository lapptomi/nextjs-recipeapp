import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

import { getSession } from "@/lib/actions/auth";
import { findRecipeById } from "@/lib/actions/recipe";
import { ROUTES } from "@/types";
import LikeButtons from "@/components/LikeButtons";
import SearchIcon from "@mui/icons-material/Search";
import RecipeCommentForm from "./RecipeCommentForm";
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

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="relative h-[460px] w-full bg-gray-900">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <Box className="flex h-full items-center justify-center">
            <RestaurantIcon className="text-gray-600" style={{ fontSize: 120 }} />
          </Box>
        )}

        <Box className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
          <Container maxWidth="lg" className="relative h-full">
            <Box className="pt-6">
              <Link href={ROUTES.RECIPES}>
                <Button startIcon={<ArrowBackIcon />} variant="contained" color="info" size="small">
                  Back to Recipes
                </Button>
              </Link>
            </Box>

            <Box className="absolute bottom-8 left-8 right-8 flex flex-col gap-3">
              {recipe.category && (
                <Chip
                  size="small"
                  label={recipe.category}
                  className="w-fit bg-orange-400 text-white"
                />
              )}
              <Typography
                variant="h3"
                className="font-bold"
                sx={{ color: "common.white", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
              >
                {recipe.title}
              </Typography>
              <Typography
                variant="body1"
                className="max-w-3xl"
                sx={{
                  color: "common.white",
                  opacity: 0.9,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {recipe.description}
              </Typography>

              <Link href={`${ROUTES.PROFILES}/${recipe.author.id}`}>
                <Box className="flex flex-row items-center gap-2">
                  <Avatar className="size-20 bg-[rgb(255_255_255_/_0.20)]">
                    {recipe.author.username[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" color="text.secondaryLight" fontWeight="normal">
                      Recipe by
                    </Typography>
                    <Typography variant="body1" color="text.primaryLight" fontWeight="medium">
                      @{recipe.author.username}
                    </Typography>
                  </Box>
                </Box>
              </Link>

              <Box className="flex flex-wrap items-center gap-3">
                <Box className="flex items-center gap-2">
                  <AccessTimeIcon sx={{ color: "common.white" }} fontSize="small" />
                  <Typography variant="body2" sx={{ color: "common.white" }}>
                    {recipe.cookingTime} min
                  </Typography>
                </Box>
                <Box className="flex items-center gap-2">
                  <RestaurantIcon sx={{ color: "common.white" }} fontSize="small" />
                  <Typography variant="body2" sx={{ color: "common.white" }}>
                    {recipe.servings} servings
                  </Typography>
                </Box>
                <Box className="flex items-center gap-2">
                  <Rating
                    value={averageRating}
                    readOnly
                    precision={0.1}
                    size="small"
                    icon={<StarIcon fontSize="inherit" className="text-yellow-400" />}
                    emptyIcon={<StarIcon fontSize="inherit" className="text-gray-400" />}
                  />
                  <Typography variant="body2" color="textPrimaryLight">
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
          <CardContent className="p-8">
            <Box className="mb-6 flex items-center gap-3">
              <Box
                className="flex size-10 items-center justify-center rounded-full "
                sx={{ bgcolor: "primary.main" }}
              >
                <RestaurantIcon className="text-white" fontSize="small" />
              </Box>
              <Typography variant="h5" color="text.primary" fontWeight="medium">
                Ingredients
              </Typography>
            </Box>

            <Box className="flex flex-col gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <Typography key={index} variant="body1" color="text.secondary">
                  - {ingredient}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card className="mb-8 overflow-hidden rounded-2xl border border-gray-200">
          <CardContent className="p-8">
            <Box className="mb-6 flex items-center gap-3">
              <Box
                className="flex size-10 items-center justify-center rounded-full"
                sx={{ bgcolor: "primary.main" }}
              >
                <SearchIcon className="text-white" fontSize="small" />
              </Box>
              <Typography variant="h5" color="text.primary" fontWeight="medium">
                Instructions
              </Typography>
            </Box>

            <Box className="flex flex-col gap-4">
              {recipe.instructions.split("\n").map((instruction, index) => (
                <Box key={index} className="flex items-start gap-4">
                  <Box
                    className="flex size-8 shrink-0 items-center justify-center rounded-full"
                    sx={{ bgcolor: "primary.main" }}
                  >
                    <Typography variant="body2" className="font-bold text-white">
                      {index + 1}
                    </Typography>
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
