import React from "react";

import AccessTime from "@mui/icons-material/AccessTime";
import Person from "@mui/icons-material/Person";
import Restaurant from "@mui/icons-material/Restaurant";
import {
  Box,
  Chip,
  ImageListItem,
  ImageListItemBar,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/types";

import type { RecipeListItem as RecipeListItemType } from "@/types";

interface Props {
  recipe: RecipeListItemType;
}

const RecipeListItem = ({ recipe }: Props) => {
  return (
    <Link key={recipe.id} href={`${ROUTES.RECIPES}/${recipe.id}`}>
      <ImageListItem className="max-h-[300px] min-h-[300px] min-w-[300px] max-w-[300px] bg-gray-200 transition duration-200 ease-in-out hover:scale-[1.01] hover:bg-gray-100">
        <Box className="absolute size-full">
          {recipe.image ? (
            <Image
              className="size-full object-cover"
              alt={recipe.title}
              src={recipe.image}
              fill={true}
              quality={20}
              loading="lazy"
            />
          ) : (
            <Restaurant className="size-full opacity-10" />
          )}
        </Box>

        <ImageListItemBar
          title={
            <Tooltip title={`Open recipe ${recipe.title}`}>
              <Typography variant="subtitle1" color="white">
                {recipe.title}
              </Typography>
            </Tooltip>
          }
          subtitle={`@${recipe.author?.username}`}
          position="top"
          actionIcon={
            <Box className="flex flex-col">
              <Rating readOnly value={recipe.averageRating} />
              <Typography variant="caption" color="white">
                {recipe.totalRatings} ratings
              </Typography>
            </Box>
          }
        />

        <ImageListItemBar
          className="flex flex-col items-start px-2 pb-2"
          position="bottom"
          sx={{
            ".MuiImageListItemBar-titleWrap": {
              maxWidth: "100%",
              padding: "8px",
            },
          }}
          title={
            <Typography
              className="line-clamp-1 whitespace-pre-wrap break-words"
              variant="caption"
            >
              {recipe.description}
            </Typography>
          }
          actionIcon={
            <Box className="flex flex-row gap-1">
              <Chip
                icon={<AccessTime color="secondary" />}
                label={
                  <Typography variant="caption" color="white">
                    {recipe.cookingTime} minutes
                  </Typography>
                }
              />
              <Chip
                icon={<Person color="secondary" />}
                label={
                  <Typography variant="caption" color="white">
                    {recipe.servings} servings
                  </Typography>
                }
              />
            </Box>
          }
        />
      </ImageListItem>
    </Link>
  );
};

export default RecipeListItem;
