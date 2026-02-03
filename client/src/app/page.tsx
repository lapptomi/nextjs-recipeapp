import { Suspense } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsIcon from "@mui/icons-material/Groups";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { getRecipes } from "@/lib/actions/recipe";
import { ROUTES } from "@/types";

import type { RecipeListItem } from "@/types";
import { APPLICATION_NAME } from "@/lib/constants";

const imgHeroRecipe = "/recipeimage.jpeg";
const imgKitchen = "/recipeimage2.jpg";

const CARD_WIDTH = 280;
const CARD_GAP = 16;

const PopularRecipeCard = ({ recipe }: { recipe: RecipeListItem }) => {
  return (
    <Link href={`${ROUTES.RECIPES}/${recipe.id}`}>
      <Card
        className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg"
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box className="relative h-48 bg-gray-100">
          {recipe.image ? (
            <CardMedia component="div" className="relative h-full w-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
                quality={80}
              />
            </CardMedia>
          ) : (
            <Box className="flex h-full items-center justify-center">
              <RestaurantMenuIcon className="text-gray-300" style={{ fontSize: 60 }} />
            </Box>
          )}
          <Box className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-sm">
            <StarIcon sx={{ color: "primary.main", fontSize: 16 }} />
            <Typography variant="caption" className="font-semibold">
              {recipe.averageRating.toFixed(1)}
            </Typography>
          </Box>
        </Box>

        <CardContent className="p-4">
          <Typography color="text.primary" variant="h6" className="mb-1 line-clamp-1 font-semibold">
            {recipe.title}
          </Typography>
          <Typography variant="caption" className="mb-2" sx={{ color: "text.secondary" }}>
            @{recipe.author.username}
          </Typography>
          <Box className="flex items-center gap-3">
            <Box className="flex items-center gap-1">
              <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {recipe.cookingTime}m
              </Typography>
            </Box>
            <Box className="flex items-center gap-1">
              <RestaurantIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {recipe.servings}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

const PopularRecipesSkeleton = () => {
  return (
    <Box
      className="grid justify-center"
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
        gap: `${CARD_GAP}px`,
      }}
    >
      {[...Array(4)].map((_, index) => (
        <Card key={index} sx={{ borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={192} />
          <CardContent>
            <Skeleton variant="text" height={28} width="80%" />
            <Skeleton variant="text" height={20} width="40%" />
            <Skeleton variant="text" height={20} width="60%" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

const PopularRecipes = async () => {
  const response = await getRecipes("pageSize=4");
  return (
    <Box
      className="grid justify-center"
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
        gap: `${CARD_GAP}px`,
      }}
    >
      {response.content.map((recipe) => (
        <PopularRecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </Box>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Box className="flex flex-col items-center text-center" sx={{ maxWidth: 300 }}>
      <Box
        className="mb-4 flex size-16 items-center justify-center rounded-full"
        sx={{ bgcolor: "primary.main" }}
      >
        {icon}
      </Box>
      <Typography variant="h6" className="mb-2 font-bold" sx={{ color: "text.primary" }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {description}
      </Typography>
    </Box>
  );
};

const LandingPage = () => {
  return (
    <Box>
      <Box className="bg-white">
        <Container maxWidth="xl" className="py-16">
          <Box className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Box className="flex flex-col gap-6">
              <Typography
                variant="h2"
                className="font-bold leading-tight"
                sx={{ color: "text.primary", fontSize: { xs: "2.5rem", md: "3.5rem" } }}
              >
                Discover & share recipes you&apos;ll love
              </Typography>
              <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 400 }}>
                Join thousands of home cooks sharing their favorite recipes. Browse, create, and
                cook delicious meals every day.
              </Typography>

              <Box className="flex gap-4 w-full">
                <Button
                  variant="contained"
                  size="large"
                  href={ROUTES.RECIPES}
                  className="p-3 flex-1"
                >
                  <Typography variant="body1" color="text.primaryLight" fontWeight="bold">
                    Browse Recipes
                  </Typography>
                </Button>

                <Button
                  color="secondary"
                  variant="outlined"
                  size="large"
                  href={ROUTES.REGISTER}
                  className="p-3 flex-1"
                >
                  <Typography variant="body1" fontWeight="bold">
                    Share Your Recipe
                  </Typography>
                </Button>
              </Box>

              <Box className="flex flex-wrap gap-8 border-t pt-6" sx={{ borderColor: "grey.200" }}>
                <Box>
                  <Typography variant="h4" className="font-bold" sx={{ color: "text.primary" }}>
                    500+
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Recipes
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" className="font-bold" sx={{ color: "text.primary" }}>
                    10K+
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Home Cooks
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" className="font-bold" sx={{ color: "text.primary" }}>
                    4.8★
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Avg Rating
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="flex justify-center">
              <Box
                className="relative overflow-hidden"
                sx={{
                  width: { xs: "100%", md: 500 },
                  height: { xs: 400, md: 560 },
                  borderRadius: 6,
                  boxShadow:
                    "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
                }}
              >
                <Image
                  src={imgHeroRecipe}
                  alt="Delicious recipe"
                  fill
                  className="object-cover"
                  priority
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box className="bg-gray-50 py-10">
        <Container maxWidth="xl">
          <Box className="mb-8 flex items-center justify-between">
            <Box>
              <Typography variant="h4" className="mb-2 font-bold" color="text.primary">
                Popular Recipes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trending dishes our community loves
              </Typography>
            </Box>
            <Link href={ROUTES.RECIPES}>
              <Button endIcon={<ArrowForwardIcon />} color="primary">
                View all
              </Button>
            </Link>
          </Box>

          <Suspense fallback={<PopularRecipesSkeleton />}>
            <PopularRecipes />
          </Suspense>
        </Container>
      </Box>

      <Box className="bg-white py-16">
        <Container maxWidth="lg">
          <Box className="mb-12 text-center">
            <Typography variant="h4" className="mb-2 font-bold" color="text.primary">
              Everything you need to cook better
            </Typography>
            <Typography variant="body1" color="text.secondary">
              All the tools and community support to become a better home cook
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<SearchIcon color="info" fontSize="large" />}
              title="Smart Search"
              description="Find exactly what you're craving with advanced filters and categories"
            />
            <FeatureCard
              icon={<RestaurantMenuIcon color="info" fontSize="large" />}
              title="Easy Creation"
              description="Share your recipes in minutes with our intuitive recipe builder"
            />
            <FeatureCard
              icon={<GroupsIcon color="info" fontSize="large" />}
              title="Active Community"
              description="Get inspired, tips, and inspiration from fellow food enthusiasts"
            />
          </Box>
        </Container>
      </Box>

      <Box className="bg-grey-50 py-12">
        <Container maxWidth="xl">
          <Box className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Box className="flex justify-center">
              <Box
                className="relative overflow-hidden"
                sx={{
                  width: { xs: "100%", md: 400 },
                  height: { xs: 400, md: 500 },
                  borderRadius: 4,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                }}
              >
                <Image
                  src={imgKitchen}
                  alt="Kitchen setup"
                  fill
                  className="object-cover"
                  quality={80}
                />
              </Box>
            </Box>

            <Box className="flex flex-col gap-6">
              <Typography variant="h3" className="font-bold leading-tight" color="text.primary">
                Start your culinary journey today
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400}>
                Sign up for a seasoned Chef {APPLICATION_NAME}, have you discover new flavors,
                master techniques, and share your passion with a community that cares.
              </Typography>
              <Box>
                <Button variant="contained" size="large" href={ROUTES.REGISTER} className="p-4">
                  <Typography variant="body1" color="text.primaryLight" fontWeight="bold">
                    Sign Up To Create Your Free Recipe
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
