'use client';

import { AccessTime, Person } from '@mui/icons-material';
import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Divider, Rating, Typography } from '@mui/material';

import styles from '@/styles/RecipeCard.module.css';

import type { Recipe, User } from '@prisma/client';

interface Props {
  recipe: Recipe & { author?: User };
}

const RecipeCard: React.FC<Props> = (props) => {
  const recipe = props.recipe;

  return (
    <Card className={styles.wrapper}>
      <CardMedia className={styles.header} />
      <Divider>
        <Typography variant="overline">
          {recipe.title}
        </Typography>
      </Divider>
  
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Typography variant="body2" color="text.secondary">
          <AccessTime color="secondary" /> {recipe.cookingTime} minutes
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <Person color="secondary" /> {recipe.servings} servings
        </Typography>
      </div>
      <CardContent className={styles.cardcontent}>
        <div className={styles.ratingwrapper}>
          <Avatar />
          <div>
            <Typography variant="body2">
              {recipe.author?.username}
            </Typography>
            <Rating
              readOnly
              size="small"
              name="simple-controlled"
              value={recipe.rating || 0}
            />
          </div>
        </div>

        <div style={{ minHeight: '50px' }}>
          <Typography variant="body2">
              Description
          </Typography>
          <Typography
            className={styles.texttest}
            variant="body2"
            color="text.secondary"
          >
            {recipe.description}
          </Typography>
        </div>

        {false && (
          <>
            <Typography variant="subtitle1">
              Instructions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {recipe.instructions}
            </Typography>
          </>
        )}
        {false && (
          <>
            <Typography variant="subtitle1">
            Ingredients
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {recipe.ingredients}
            </Typography>

          </>
        )}
      </CardContent>

      <CardActions className={styles.cardactions}>
        {/*
  <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <Chip
            size="small"
            variant="outlined"
            icon={<AccessTime color="secondary" />}
            label={
              <Typography variant="body2" color="text.secondary">
                {recipe.cookingTime} minutes
              </Typography>
            }
          />
          <Chip
            size="small"
            variant="outlined"
            icon={<Person color="secondary" />}
            label={
              <Typography variant="body2" color="text.secondary">
                {recipe.servings} servings
              </Typography>
            }
          />
        </div>
        */}

        <Button href={`/recipes/${recipe.id}`}>
          <Typography variant="caption" color="secondary">
            Open Recipe
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;