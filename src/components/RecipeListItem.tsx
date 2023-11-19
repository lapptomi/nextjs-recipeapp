/* eslint-disable @next/next/no-img-element */

import { AccessTime, Person } from "@mui/icons-material";
import { Chip, Container, ImageListItem, ImageListItemBar, Rating, Typography } from "@mui/material";
import Link from "next/link";

import styles from "@/styles/RecipeListItem.module.css";

import type { RecipeWithAuthor } from "../types";

interface Props {
  recipe: RecipeWithAuthor & { img: any };
}

const RecipeListItem: React.FC<Props> = ({ recipe }) => {
  return (
    <Link href={`/recipes/${recipe.id}`} key={recipe.img}>
      <ImageListItem
        className={styles.imagelistitem}
        key={recipe.img}
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
        <img
          style={{ position: 'absolute', zIndex: -1 }}
          src={`${recipe.img}?w=248&fit=crop&auto=format`}
          alt={recipe.title}
          loading="lazy"
        />
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