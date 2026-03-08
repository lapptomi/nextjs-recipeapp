import { Suspense } from "react";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsIcon from "@mui/icons-material/Groups";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { APPLICATION_NAME } from "@/lib/constants";
import { ROUTES } from "@/types";

import FeatureCard from "./components/FeatureCard";
import PopularRecipes from "./components/PopularRecipes";
import PopularRecipesSkeleton from "./components/PopularRecipesSkeleton";

const imgHeroRecipe = "/recipeimage.jpeg";
const imgKitchen = "/recipeimage2.jpg";

export default function LandingPage() {
  return (
    <Box>
      <Box className="bg-white">
        <Container maxWidth="xl" className="py-16">
          <Box className="bg flex flex-row flex-wrap items-center justify-evenly gap-4">
            <Box className="max-w-[500px] min-w-[500px] flex flex-col gap-6">
              <Typography variant="h2" fontWeight="bold" color="text.primary">
                Discover & share recipes you&apos;ll love
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="normal">
                Join thousands of home cooks sharing their favorite recipes. Browse, create, and
                cook delicious meals every day.
              </Typography>

              <Box className="flex w-full gap-4">
                <Button
                  variant="contained"
                  size="large"
                  href={ROUTES.RECIPES}
                  className="flex-1 p-3"
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
                  className="flex-1 p-3"
                >
                  <Typography variant="body1" fontWeight="bold">
                    Share Your Recipe
                  </Typography>
                </Button>
              </Box>
            </Box>

            <Box className="flex justify-center">
              <Box className="relative h-[560px] w-[500px] overflow-hidden rounded-3xl shadow-xl">
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
              <Box className="relative h-[500px] w-[400px] overflow-hidden rounded-3xl shadow-2xl">
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
}
