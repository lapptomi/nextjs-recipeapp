import React from "react";

import AccessTime from "@mui/icons-material/AccessTime";
import Person from "@mui/icons-material/Person";
import Restaurant from "@mui/icons-material/Restaurant";
import {
  Chip,
  ImageListItem,
  ImageListItemBar,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { PAGES, type Recipe, type RecipeRatingType } from "@/types";

interface Props {
  recipe: Recipe;
}

const RecipeListItem = ({ recipe }: Props) => {
  const countRatings = (type: RecipeRatingType) =>
    recipe.ratings.filter((rating) => rating.type === type).length;

  const likes = countRatings("LIKE");
  const dislikes = countRatings("DISLIKE");

  return (
    <Link key={recipe.id} href={`${PAGES.RECIPES}/${recipe.id}`}>
      <ImageListItem className="max-h-[300px] min-h-[300px] min-w-[300px] max-w-[300px] bg-gray-200 transition duration-200 ease-in-out hover:scale-[1.01] hover:bg-gray-100">
        <div className="absolute size-full">
          {recipe.image ? (
            <Image
              alt={recipe.title}
              src={recipe.image}
              quality={20}
              loading="lazy"
              fill={true}
            />
          ) : (
            <Restaurant className="size-full opacity-10" />
          )}
        </div>

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
            <div className="flex flex-col">
              <Rating readOnly value={(likes / (likes + dislikes)) * 5} />
              <Typography variant="caption" color="white">
                {recipe.ratings.length} ratings
              </Typography>
            </div>
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
            <div className="flex flex-row gap-1">
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
            </div>
          }
        />
      </ImageListItem>
    </Link>
  );
};

export default RecipeListItem;
