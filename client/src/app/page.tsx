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
import RecipeListCardSmall from "@/components/RecipeListCardSmall";

const imgHeroRecipe = "/recipeimage.jpeg";
const imgKitchen = "/recipeimage2.jpg";

const CARD_WIDTH = 280;
const CARD_GAP = 16;

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
  const response = await getRecipes("page=1&page_size=4");
  return (
    <Box
      className="grid justify-center"
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
        gap: `${CARD_GAP}px`,
      }}
    >
      {response.content.map((recipe) => (
        <RecipeListCardSmall key={recipe.id} recipe={recipe} />
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
          <Box className="flex items-center gap-4 flex-row bg justify-evenly flex-wrap">
            <Box className="flex flex-col gap-6 max-w-[500px] min-w-[500px] ">
              <Typography variant="h2" fontWeight="bold" color="text.primary">
                Discover & share recipes you&apos;ll love
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="normal">
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

              <Box className="flex flex-wrap gap-8 border-t pt-6">
                <Box>
                  <Typography variant="h4" className="font-bold" color="text.primary">
                    500+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recipes
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" className="font-bold" color="text.primary">
                    10K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Home Cooks
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" className="font-bold" color="text.primary">
                    4.8★
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Rating
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="flex justify-center">
              <Box className="relative overflow-hidden w-[500px] h-[560px] rounded-3xl shadow-xl">
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
          <Box className="mb-8 flex items-center justify-center">
            <Box className="flex w-full max-w-[1200px] items-center justify-between">
              <Box>
                <Typography variant="h4" className="mb-2 font-bold" color="text.primary">
                  Popular Recipes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trending dishes our community loves
                </Typography>
              </Box>
              <Link href={ROUTES.RECIPES}>
                <Button endIcon={<ArrowForwardIcon />} color="secondary">
                  View all
                </Button>
              </Link>
            </Box>
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

      <Box className="bg-gray-50 py-12">
        <Container maxWidth="xl">
          <Box className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Box className="flex justify-center">
              <Box className="relative overflow-hidden w-[400px] h-[500px] rounded-3xl shadow-2xl">
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
              <Typography variant="h6" color="text.secondary" fontWeight="normal">
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
