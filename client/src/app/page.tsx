

import { Suspense } from 'react';

import { Restaurant } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import Image from 'next/image';

import Await from '@/components/Await';
import PricingCard from '@/components/PricingCard';
import RecipeList from '@/components/RecipeList';
import RecipeListSkeleton from '@/components/RecipeListSkeleton';
import { getRecipes } from '@/lib/actions/recipe';
import { APPLICATION_NAME } from '@/lib/constants';
import { PAGES } from '@/types';

import recipeimage from '../../public/recipeimage.jpeg';

const Home = () => {
  const fetchRecipes = async () => {
    try {
      const recipes = await getRecipes();
      return recipes.content;
    } catch {
      return [];
    }
  };
  
  return (
    <div>
      <div className='flex min-h-[600px] flex-row flex-wrap items-center justify-evenly gap-10 bg-gray-50 p-12'>
        <div className='flex max-w-[500px] flex-col gap-3'>
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

      <div className='flex flex-col items-center border-t border-gray-100 bg-white p-4'>
        <Typography variant="body2" fontWeight="bold">
          RECOMMENDED
        </Typography>
        
        <Suspense fallback={<RecipeListSkeleton />}>
          <Await promise={fetchRecipes()}>
            {(resolvedRecipes) => <RecipeList recipes={resolvedRecipes.slice(0, 4)} />}
          </Await>
        </Suspense>

        <Button variant="outlined" href={PAGES.RECIPES} color="primary">
          View all recipes
        </Button>
      </div>

      <div className='flex min-h-[600px] flex-row flex-wrap items-center justify-evenly gap-10 bg-white p-12'>
        <Restaurant className='size-64 text-gray-300' />
        <div className='flex max-w-[500px] flex-col gap-4'>
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

      <div className='flex flex-col flex-wrap items-center justify-center gap-8 bg-gray-50 px-2 py-24'>
        <Typography variant="h4" fontWeight="medium">
          Choose Plan
        </Typography>
        <div className='flex flex-row flex-wrap justify-center gap-4'>
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
