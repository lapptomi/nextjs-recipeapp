"use client";

import { useEffect, useState } from "react";

import { AccessTime, Person, Restaurant } from "@mui/icons-material";
import { Chip, Container, ImageListItem, ImageListItemBar, Rating, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { getSignedImageUrl } from "@/actions/aws_s3";
import styles from "@/styles/RecipeListItem.module.css";

import type { RecipeWithAuthor } from "../types";

interface Props {
  recipe: RecipeWithAuthor;
}

const RecipeListItem: React.FC<Props> = ({ recipe }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (recipe.image) {
      getSignedImageUrl(recipe.image)
        .then((response) => {
          if (response) {
            setImageUrl(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [recipe.image]);

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <ImageListItem className={styles.imagelistitem}>
        <ImageListItemBar
          title={recipe.title}
          subtitle={`@${recipe.author?.username}`}
          position="top"
          actionIcon={
            <div className={styles.imagelist_top}>
              <Rating readOnly value={recipe.rating || 2} />
              <Typography variant="caption" color="white">
                {recipe.rating || 0} ratings
              </Typography>
            </div>
          }
        />

        <div className={styles.recipebackground}>
          {imageUrl ? (
            <Image
              alt={recipe.id.toString()}
              src={imageUrl}
              quality={30}
              loading="lazy"
              layout="fill"
              style={{ zIndex: -1 }}
            />
          ) : (
            <Restaurant className={styles.placeholdericon} />
          )}
        </div>

        <ImageListItemBar
          position='bottom'
          actionIcon={
            <Container>
              <Typography className={styles.itemdescription} variant="caption">
                {recipe.description}
              </Typography>
              <Chip
                icon={<AccessTime color="primary" /> }
                label={
                  <Typography variant="caption" color="white">
                    {recipe.cookingTime} minutes
                  </Typography>
                }
              />
              <Chip
                icon={<Person color="primary" /> }
                label={
                  <Typography variant="caption" color="white">
                    {recipe.servings} servings
                  </Typography>
                }
              />
            </Container>
          }
        />
      </ImageListItem>
    </Link>
  );
};

export default RecipeListItem;