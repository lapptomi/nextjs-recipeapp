import { AccessTime, Person } from '@mui/icons-material';
import { Avatar, Divider, List, ListItem, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { getSignedImageUrl } from '@/actions/aws_s3';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Comments from '@/components/Comments';
import RecipeCommentForm from '@/components/RecipeCommentForm';
import TitleHeader from '@/components/TitleHeader';
import { prisma } from '@/lib/db';

import styles from './page.module.css';

interface Props {
  params: {
    id: string;
  }
}

const RecipePage = async ({ params }: Props) => {
  const session = await getServerSession(options);
  const recipeWithComments = await prisma.recipe.findUnique({
    where: {
      id: parseFloat(params.id)
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
  const recipeImage = await getSignedImageUrl(recipeWithComments?.image || '');

  if (!recipeWithComments) {
    return <TitleHeader title="Recipe not found" />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.recipecontainer}>                      
        <div
          className={styles.headercontainer}
          style={{
            backgroundImage: `url(${recipeImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}>
          <div className={styles.headertitle}>
            <Typography variant="h4">{recipeWithComments.title.toUpperCase()}</Typography>
            
            <div style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center' }}>
              <Link href={`/profiles/${recipeWithComments.author?.id}`}>
                <Tooltip title={`View profile of ${recipeWithComments.author.username}`}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  
                  }}>
                    <Avatar sx={{ width: 80, height: 80 }} />
                    <div>
                      <Typography variant="subtitle1">
                        Created By
                      </Typography>
                      <Typography variant="h5">
                        {recipeWithComments.author?.username}
                      </Typography>
                    </div>
                  </div>
                </Tooltip>
              </Link>
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