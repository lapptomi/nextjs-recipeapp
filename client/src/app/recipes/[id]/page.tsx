import { AccessTime, Person, Restaurant } from '@mui/icons-material';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { options } from '@/app/api/auth/[...nextauth]/options';
import LikeButtons from '@/components/LikeButtons';
import RecipeCommentForm from '@/components/RecipeCommentForm';
import TitleHeader from '@/components/TitleHeader';
import { NEXT_APP_API_URL } from '@/lib/config';

import styles from './page.module.css';

import type { Recipe } from '@/types';

interface Props {
  params: {
    id: string;
  }
}

const RecipePage = async ({ params }: Props) => {
  const session = await getServerSession(options);
  const response = await axios.get<Recipe>(`${NEXT_APP_API_URL}/api/recipes/${params.id}`);
  const recipe = response.data;
  
  if (!recipe) {
    return <TitleHeader title="Recipe not found" />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.recipecontainer}>
        <div className={styles.recipeinfocontainer}>
          <div className={styles.headertitle}>
            <Typography variant="h3" fontWeight="medium">
              {recipe.title.toUpperCase()}
            </Typography>
            <Link href={`/profiles/${recipe.author.id}`}>
              <div className={styles.avatarcontainer}>
                <Avatar sx={{ width: 80, height: 80 }} />
                <div>
                  <Typography variant="subtitle1">
                    Created By
                  </Typography>
                  <Typography variant="h5">
                    {recipe.author.username}
                  </Typography>
                </div>
              </div>
            </Link>
            <LikeButtons session={session} recipe={recipe} />
          </div>

          <div className={styles.imagecontainer}>
            {recipe.image ? (
              <Image
                src={recipe.image}
                alt={recipe.title}
                layout='fill'
              />
            ) : (
              <Restaurant className={styles.placeholdericon} />
            )}
          </div>
        </div>

        <div className={styles.recipedatacontainer}>
          <Divider>
            <Typography variant="h5">ABOUT</Typography>
            <Typography variant="overline">
              <AccessTime color="secondary" />
              {recipe.cookingTime} minutes
            </Typography>
            <Typography variant="overline">
              <Person color="secondary" />
              {recipe.servings} servings
            </Typography>
          </Divider>
          
          <Typography variant="body1">
            {recipe.description}
          </Typography>

          <Divider>
            <Typography variant="h5">INGREDIENTS</Typography>
          </Divider>

          <List dense={true}>
            {recipe.ingredients.map((ingredient, index: number) => (
              <ListItem key={ingredient}>
                <Typography key={index} variant="body2">
                  - {ingredient} <br/>
                </Typography>
              </ListItem>
            ))}
          </List>

          <Divider>
            <Typography variant="h5">INSTRUCTIONS</Typography>
          </Divider>
          <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
            {recipe.instructions}
          </Typography>
          
          <div>
            <List style={{ display: 'flex', flexDirection: 'column', width: '100%', background: 'white' }}>
              <Divider>
                <Typography variant="body1">
                  {recipe.comments.length} COMMENTS
                </Typography>
              </Divider>
              {(recipe.comments ?? []).map((comment, index: number) => (
                <ListItem key={index} className={styles.recipecomment}>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText primary={
                    <Typography variant='body1'>
                      <Tooltip title={`View profile of ${comment.author.username}`}>
                        <Link href={`/profiles/${comment.author.id}`}>
                          {comment.author.username}-
                          <Typography variant="caption">
                            {comment.createdAt && new Date(comment.createdAt).toISOString().split('T')[0]} 
                          </Typography>
                        </Link>
                      </Tooltip>
                    </Typography>
                  }
                  secondary={comment.message}
                  />
                </ListItem>
              ))}
            </List>

            {session?.user && recipe
              ? <RecipeCommentForm recipe={recipe} />
              : <Typography variant="body1">Please sign in to comment...</Typography>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;