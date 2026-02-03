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
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { getSession } from "@/lib/actions/auth";
import { findRecipeById } from "@/lib/actions/recipe";
import { ROUTES } from "@/types";
import LikeButtons2 from "@/components/LikeButtons2";
import SearchIcon from "@mui/icons-material/Search";
interface Props {
  params: Promise<{ id: string }>;
}

const RecipeDetailPage = async ({ params }: Props) => {
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
      <Box className="relative h-[400px] w-full bg-gray-900">
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
                <Button
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    bgcolor: "white",
                    color: "text.primary",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  size="small"
                >
                  Back to Recipes
                </Button>
              </Link>
            </Box>

            <Box className="absolute bottom-8 left-8 right-8 flex flex-col gap-3">
              <Chip label={"CATEGORY"} className="w-fit bg-orange-400 text-white" />
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
                  <Avatar
                    sx={{
                      background: "rgba(255, 255, 255, 0.20)",
                      width: 70,
                      height: 70,
                    }}
                  >
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
                  <Typography variant="body2" sx={{ color: "common.white" }}>
                    {averageRating.toFixed(1)} ({recipe.ratings.length})
                  </Typography>
                </Box>
              </Box>

              <LikeButtons2 recipe={recipe} session={session} />
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg" className="py-8">
        <Card className="mb-8 overflow-hidden rounded-2xl border border-gray-200">
          <CardContent className="p-8">
            <Box className="mb-6 flex items-center gap-3">
              <Box
                className="flex size-10 items-center justify-center rounded-full"
                sx={{ bgcolor: "primary.main" }}
              >
                <RestaurantIcon sx={{ color: "primary.contrastText" }} fontSize="small" />
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
                <SearchIcon sx={{ color: "primary.contrastText" }} fontSize="small" />
              </Box>
              <Typography variant="h5" color="text.primary" fontWeight="medium">
                Instructions
              </Typography>
            </Box>

            <Box className="flex flex-col gap-4">
              {recipe.instructions
                .split("\n")
                .filter(Boolean)
                .map((instruction, index) => (
                  <Box key={index} className="flex items-start gap-4">
                    <Box
                      className="flex size-8 shrink-0 items-center justify-center rounded-full"
                      sx={{ bgcolor: "primary.main" }}
                    >
                      <Typography
                        variant="body2"
                        className="font-bold"
                        sx={{ color: "primary.contrastText" }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>
                    <Typography variant="body1" className="pt-1" sx={{ color: "text.secondary" }}>
                      {instruction}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border border-gray-200">
          <CardContent className="p-8">
            <Typography variant="h5" className="mb-6" color="text.primary" fontWeight="medium">
              Comments
            </Typography>

            {session?.user ? (
              <Box className="mb-8">
                <Typography
                  variant="subtitle1"
                  className="mb-3"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Leave a Comment
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Share your experience with this recipe..."
                  variant="outlined"
                  className="mb-3"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "grey.50",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "grey.400",
                      },
                    },
                  }}
                />
                <Button variant="contained" color="primary">
                  Submit Comment
                </Button>
              </Box>
            ) : (
              <Box className="mb-8 rounded-lg bg-gray-100 p-4 text-center">
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Please{" "}
                  <Link href={ROUTES.LOGIN} className="underline">
                    <Typography
                      component="span"
                      sx={{ color: "primary.main", "&:hover": { color: "primary.dark" } }}
                    >
                      sign in
                    </Typography>
                  </Link>{" "}
                  to leave a comment
                </Typography>
              </Box>
            )}

            <Divider className="mb-6" />

            {recipe.comments.length > 0 ? (
              <List className="flex flex-col gap-4">
                {recipe.comments.map((comment, index) => (
                  <ListItem
                    key={index}
                    className="rounded-lg bg-gray-50 p-4"
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {comment.author.username[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box className="mb-2 flex items-center gap-2">
                          <Link href={`${ROUTES.PROFILES}/${comment.author.id}`}>
                            <Typography
                              variant="subtitle2"
                              className="font-semibold hover:underline"
                              sx={{ color: "text.primary" }}
                            >
                              @{comment.author.username}
                            </Typography>
                          </Link>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {comment.createdAt &&
                              new Date(comment.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {comment.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box className="py-8 text-center">
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  No comments yet. Be the first to share your thoughts!
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RecipeDetailPage;
