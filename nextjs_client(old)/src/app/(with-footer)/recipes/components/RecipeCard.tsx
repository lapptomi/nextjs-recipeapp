import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import { Box, Card, CardContent, CardMedia, Chip, Rating, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/types";

import type { RecipeListItem } from "@/types";

interface RecipeCardProps {
  recipe: RecipeListItem;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`${ROUTES.RECIPES}/${recipe.id}`} className="block h-full w-full">
      <Card className="h-full w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
        <Box className="group relative h-[250px] overflow-hidden bg-gray-100 transition-all duration-200">
          {recipe.image ? (
            <CardMedia component="div" className="relative h-full w-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
                quality={80}
                loading="lazy"
              />
            </CardMedia>
          ) : (
            <Box className="flex h-full items-center justify-center">
              <RestaurantIcon className="text-gray-300" style={{ fontSize: 80 }} />
            </Box>
          )}

          <Box className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {recipe.category && (
            <Chip
              label={recipe.category}
              className="absolute left-3 top-3 bg-white/95 shadow-sm"
              size="small"
            />
          )}
        </Box>

        <CardContent className="flex flex-col gap-3 p-5">
          <Box className="flex flex-col gap-1">
            <Typography
              variant="h6"
              className="line-clamp-1"
              fontWeight="bold"
              color="text.primary"
            >
              {recipe.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{recipe.author?.username}
            </Typography>
            <Typography variant="caption" className="line-clamp-2">
              {recipe.description}
            </Typography>
          </Box>

          <Box className="flex items-center gap-2">
            <Rating
              value={recipe.averageRating}
              readOnly
              precision={0.5}
              size="small"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Typography variant="body2" color="text.secondary">
              {recipe.averageRating?.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              ({recipe.totalRatings})
            </Typography>
          </Box>

          <Box className="flex items-center gap-4">
            <Box className="flex items-center gap-1.5">
              <AccessTimeIcon className="text-gray-500" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {recipe.cookingTime} min
              </Typography>
            </Box>
            <Box className="flex items-center gap-1.5">
              <RestaurantIcon className="text-gray-500" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {recipe.servings} servings
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
