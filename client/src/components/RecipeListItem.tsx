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
  Typography
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import styles from "@/styles/RecipeListItem.module.css";
import { PAGES, type Recipe, type RecipeRatingType } from "@/types";

interface Props {
  recipe: Recipe;
}

const RecipeListItem = ({ recipe }: Props) => {
  const countRatings = (type: RecipeRatingType) => (
    recipe.ratings.filter((rating) => rating.type === type).length
  );
  const likes = countRatings('LIKE');
  const dislikes = countRatings('DISLIKE');

  return (
    <Link key={recipe.id} href={`${PAGES.RECIPES}/${recipe.id}`}>
      <ImageListItem className={styles.imagelistitem}>
        <div className={styles.recipebackground}>
          {recipe.image ? (
            <Image
              alt={recipe.title}
              src={recipe.image}
              quality={20}
              loading="lazy"
              fill={true}
            />
          ) : (
            <Restaurant className={styles.placeholdericon} />
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
            <div className={styles.imagelist_top}>
              <Rating
                readOnly
                value={likes / (likes + dislikes) * 5}
              />
              <Typography variant="caption" color="white">
                {recipe.ratings.length} ratings
              </Typography>
            </div>
          }
        />

        <ImageListItemBar
          position='bottom'
          actionIcon={
            <div style={{ padding: 5 }}>
              <Typography className={styles.itemdescription} variant="caption">
                {recipe.description}
              </Typography>
              <div>
                <Chip
                  icon={<AccessTime color="secondary" /> }
                  label={
                    <Typography variant="caption" color="white">
                      {recipe.cookingTime} minutes
                    </Typography>
                  }
                />
                <Chip
                  icon={<Person color="secondary" /> }
                  label={
                    <Typography variant="caption" color="white">
                      {recipe.servings} servings
                    </Typography>
                  }
                />
              </div>
            </div>
          }
        />
      </ImageListItem>
    </Link>
  );
};

export default RecipeListItem;