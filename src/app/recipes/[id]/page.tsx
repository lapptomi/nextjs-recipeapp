import { AccessTime, Person } from '@mui/icons-material';
import { Avatar, Divider, List, ListItem, Rating, Typography } from '@mui/material';
import { getServerSession } from 'next-auth';

import { options } from '@/app/api/auth/[...nextauth]/options';
import Comments from '@/components/Comments';
import RecipeCommentForm from '@/components/RecipeCommentForm';
import TitleHeader from '@/components/TitleHeader';
import { prisma } from '@/config/db';
import styles from '@/styles/RecipePage.module.css';

interface Props {
  params: {
    id: string;
  }
}

const RecipePage = async ({ params }: Props) => {
  const session = await getServerSession(options);

  const recipeWithComments = await prisma.recipe.findUnique({
    where: {
      id: parseInt(params.id)
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        }
      }
    },
  });
  
  if (!recipeWithComments) {
    return <TitleHeader title="Recipe not found" />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.recipecontainer}>                      
        <div className={styles.headercontainer}>
          <div className={styles.headertitle}>
            <Typography variant="h4">{recipeWithComments.title.toUpperCase()}</Typography>
            <div style={{ display: 'flex',  alignItems: 'center' }}>
              <Avatar sx={{ width: 80, height: 80 }} />
              <div>
                <Typography variant="body1">
                  {recipeWithComments.author?.username}
                </Typography>
                <Rating
                  size="large"
                  name="simple-controlled"
                  value={recipeWithComments.rating || 2}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.recipedatacontainer}>
          <Divider>
            <Typography variant="h5">ABOUT</Typography>
            <Typography variant="overline">
              <AccessTime color="primary" />
              {recipeWithComments.cookingTime} minutes
            </Typography>
            <Typography variant="overline">
              <Person color="primary" />
              {recipeWithComments.servings} servings
            </Typography>
          </Divider>
          
          <Typography variant="body1">
            {recipeWithComments.description}
          </Typography>

          <Divider>
            <Typography variant="h5">INGREDIENTS</Typography>
          </Divider>

          <List dense={true}>
            {recipeWithComments.ingredients.map((ingredient, index) => (
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
          <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
            {recipeWithComments.instructions}
          </Typography>
          
          <div>
            <Comments comments={recipeWithComments.comments ?? []} />
            {session?.user && recipeWithComments
              ? <RecipeCommentForm recipe={recipeWithComments} />
              : <Typography variant="body1">Please sign in to comment...</Typography>
            }
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecipePage;