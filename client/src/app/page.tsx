import { Restaurant } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

import PricingCard from '@/components/PricingCard';
import RecipeList from '@/components/RecipeList';
import { getRecipes } from '@/lib/actions/recipe';
import config from '@/lib/config';

import styles from './page.module.css';

const RecipeListContainer = async ({ response, title }: any) => {
  const recipes = response.content.slice(0, 4);
  return (
    <div className={styles.recipelistcontainer}>
      <Typography variant="overline" fontWeight="medium">
        {title}:
      </Typography>
      <RecipeList recipes={recipes} />
      <Button variant="outlined" href='/recipes' color="primary">
        View all recipes
      </Button>
    </div>
  );
};

const Home = async () => {
  const response = await getRecipes();
  
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headercontainer}>
          <Typography variant="h3" fontWeight="bold">
            {config.APPLICATION_NAME}
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
          src={'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505'}
          alt="food"
          quality={10}
          width={500}
          height={500}
        />
      </div>

      <RecipeListContainer response={response} title="Recently Added Recipes" />
      <RecipeListContainer response={response} title="Recommended" />

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
