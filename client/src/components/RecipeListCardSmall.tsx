import { RecipeListItem, ROUTES } from "@/types";
import { Card, CardMedia, Typography, CardContent } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { PeopleOutline } from "@mui/icons-material";

export default function RecipeListCardSmall({ recipe }: { recipe: RecipeListItem }) {
  return (
    <Link href={`${ROUTES.RECIPES}/${recipe.id}`}>
      <Card
        className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg border-radius-3"
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
              <RestaurantIcon className="text-gray-300" style={{ fontSize: 60 }} />
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
          <Typography variant="body2" className="mb-2 text-gray-600">
            @{recipe.author.username}
          </Typography>
          <Box className="flex items-center gap-4">
            <Box className="flex items-center gap-1.5">
              <AccessTimeIcon className="text-gray-500" fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                {recipe.cookingTime} min
              </Typography>
            </Box>
            <Box className="flex items-center gap-1.5">
              <PeopleOutline className="text-gray-500" fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                {recipe.servings} servings
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
