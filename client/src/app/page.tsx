import { Restaurant } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

import PricingCard from '@/components/PricingCard';
import RecipeList from '@/components/RecipeList';
import { getRecipes } from '@/lib/actions/recipe';
import { APPLICATION_NAME } from '@/lib/constants';
import { PAGES } from '@/types';

import styles from './page.module.css';
import recipeimage from '../../public/recipeimage.jpeg';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const Home = async () => {
  const response = await getRecipes();
  const recipes = response.content ?? [];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headercontainer}>
          <Typography variant="h3" fontWeight="bold">
            {APPLICATION_NAME}
          </Typography>
          <Typography variant="h6" fontWeight="normal">
            Your favourite recipe app. <br />
            Rate recipes, share your own, and so much more!
          </Typography>
          <Button variant="contained" href={PAGES.RECIPES} color="primary">
            Get Started
          </Button>
        </div>
        <Image src={recipeimage} alt="food" quality={10} width={500} height={500} />
      </div>

      <div className={styles.recipelistcontainer}>
        <Typography variant="body2" fontWeight="bold">
          RECOMMENDED
        </Typography>
        <RecipeList recipes={recipes.sort((a, b) => b.ratings.length - a.ratings.length).slice(0, 4)} />
        <Button variant="outlined" href={PAGES.RECIPES} color="primary">
          View all recipes
        </Button>
      </div>

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
          <Button variant="contained" href={PAGES.RECIPES} color="primary">
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
