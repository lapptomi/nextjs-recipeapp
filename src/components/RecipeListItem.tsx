"use client";

import { useEffect, useState } from "react";

import { AccessTime, Person } from "@mui/icons-material";
import { Chip, Container, ImageListItem, ImageListItemBar, LinearProgress, Rating, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { getSignedImageUrl } from "@/actions/aws_s3";
import styles from "@/styles/RecipeListItem.module.css";

import type { RecipeWithAuthor } from "../types";

interface Props {
  recipe: RecipeWithAuthor;
}

const RecipeListItem: React.FC<Props> = ({ recipe }) => {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
    
  useEffect(() => {
    getSignedImageUrl(recipe?.image || '')
      .then((response) => {
        if (response) {
          setImageUrl(response);
        }
      }).catch((error) => console.log('Error fetching presigned URL:', error))
      .finally(() => setLoading(false));
  }, [recipe.image]);

  return (
    <Link href={`/recipes/${recipe.id}`} key={recipe.title}>
      <ImageListItem
        className={styles.imagelistitem}
        key={recipe.title}
      >
        <ImageListItemBar
          className={styles.itembackground}
          title={recipe.title}
          subtitle={`@${recipe.author?.username}`}
          position="top"
          actionIcon={
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Rating readOnly value={recipe.rating || 2} />
              <Typography variant="caption" color="white">12 ratings</Typography>
            </div>
          }
        />
        {loading ? (
          <LinearProgress color="primary" />
        ) : (
          <Image
            alt="recipe image"
            width={300}
            height={300}  
            src={imageUrl}
            quality={20}
            loading="lazy"
          />
        )}
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