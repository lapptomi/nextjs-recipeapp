import { AccessTime, Person, Restaurant } from '@mui/icons-material';
import { Chip, Container, ImageListItem, ImageListItemBar, Link, Rating, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';

import SearchRecipesForm from '@/components/SearchRecipesForm';
import TitleHeader from '@/components/TitleHeader';
import { BASE_URL } from '@/lib/constants';
import { prisma } from '@/lib/db';

import styles from './page.module.css';

import type { RecipeIncludeRelations } from '@/types';

interface Params {
  searchParams: {
    page?: string;
    pageSize?: string;
    title?: string;
  };
}

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const totalCount = await prisma.recipe.count();
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');

  const recipes = await axios.get<RecipeIncludeRelations[]>(`${BASE_URL}/api/recipes?${queryParams}`)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      <SearchRecipesForm totalCount={totalCount} />

      <div className={styles.container}>
        {recipes && recipes.length > 0 ? (
          <div className={styles.recipegrid}>
            {recipes.map((recipe) => {
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
            })}
          </div>
        ) : (
          <div>
            <Typography variant="h4">No recipes found.</Typography>
            <Typography variant="body1">Be the first to create one!</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseRecipesPage;