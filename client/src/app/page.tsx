import { Restaurant } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

import PricingCard from '@/components/PricingCard';
import RecipeList from '@/components/RecipeList';
import { getRecipes } from '@/lib/actions/recipe';
import { APPLICATION_NAME } from '@/lib/constants';

import styles from './page.module.css';
import recipeimage from '../../public/recipeimage.jpeg';

import type { Recipe } from '@/types';

const RecipeListContainer = async ({ recipes, title }: {
  recipes: Recipe[];
  title: string;
}) => {
  return (
    <div className={styles.recipelistcontainer}>
      <Typography variant="overline" fontWeight="medium">
        {title}:
      </Typography>
      <RecipeList recipes={recipes.slice(0, 4)} />
      <Button variant="outlined" href='/recipes' color="primary">
        View all recipes
      </Button>
    </div>
  );
};

export const dynamic = 'force-dynamic';

const Home = async () => {
  const response = await getRecipes();
  const sortByDate = response.content.sort((a, b) => (
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
  const sortByRating = response.content.sort((a, b) => b.ratings.length - a.ratings.length);
  
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headercontainer}>
          <Typography variant="h3" fontWeight="bold">
            {APPLICATION_NAME}
          </Typography>
          <Typography variant="h5">
            Your favourite recipe app. <br />
            Rate recipes, share your own, and so much more!
          </Typography>
          <Button variant="contained" href='/recipes' color="primary">
            Get Started
          </Button>
        </div>

        <Image
          src={recipeimage}
          alt="food"
          quality={10}
          width={500}
          height={500}
        />
      </div>

      <RecipeListContainer recipes={sortByDate} title="Recently Added Recipes" />
      <RecipeListContainer recipes={sortByRating} title="Recommended" />

      <div className={styles.header}>
        <Restaurant style={{ width: 300, height: 300, color: 'gray' }} />
        <div className={styles.headercontainer}>
          <Typography variant="h4" fontWeight="bold">
            All Your Favourite Recipes In One Place
          </Typography>
          <Typography variant="body1">
            Manage, find and share your favourite recipes. <br />
            Join our community and start cooking today!
          </Typography>
          <Button variant="contained" href='/recipes' color="primary">
            Get Started
          </Button>
        </div>
      </div>

      <div className={styles.cardcontainer}>
        <Typography variant="h4" fontWeight="medium">
          Choose Plan
        </Typography>
        <div className={styles.cardrow}>
          <PricingCard
            title="Personal"
            description="Some random description"
          />
          <PricingCard
            title="Professional"
            price={10}
            description="Some random description"
          />
          <PricingCard
            title="Enterprise"
            price={1337}
            description="Some random description"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
