import { AccessTime, Person, Restaurant } from "@mui/icons-material";
import { Chip, Container, ImageListItem, ImageListItemBar, Rating, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import styles from "@/styles/RecipeListItem.module.css";

import type { RecipeIncludeRelations } from "@/types";

interface Props {
  recipe: RecipeIncludeRelations;
}

const RecipeListItem: React.FC<Props> = async ({ recipe }) => {
  const likes = recipe.ratings.filter((rating) => rating.type === 'LIKE').length;
  const dislikes = recipe.ratings.filter((rating) => rating.type === 'DISLIKE').length;

  return (
    <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
      <ImageListItem className={styles.imagelistitem}>
        <div className={styles.recipebackground}>
          {recipe.image ? (
            <Image
              alt={recipe.title}
              src={recipe.image}
              quality={20}
              loading="lazy"
              layout="fill"
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