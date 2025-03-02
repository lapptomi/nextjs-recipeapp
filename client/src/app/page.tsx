import { Suspense } from "react";

import { Button, Typography } from "@mui/material";
import Image from "next/image";

import recipeimage from "../../public/recipeimage.jpeg";
import recipeimage2 from "../../public/recipeimage2.jpg";
import Await from "../components/Await";
import PricingCard from "../components/PricingCard";
import RecipeList from "../components/RecipeList";
import RecipeListSkeleton from "../components/RecipeListSkeleton";
import { getRecipes } from "../lib/actions/recipe";
import { APPLICATION_NAME } from "../lib/constants";
import { PAGES } from "../types";

const Home = () => {
  return (
    <div>
      <div className="flex min-h-[600px] flex-row flex-wrap items-center justify-evenly gap-10 bg-white p-10">
        <div className="flex max-w-[500px] flex-col gap-6">
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
        <Image
          src={recipeimage}
          alt="food"
          quality={10}
          width={600}
          height={600}
        />
      </div>

      <div className="flex flex-col items-center bg-gray-50 p-10">
        <Typography variant="body2" fontWeight="bold">
          RECOMMENDED
        </Typography>

        <Suspense fallback={<RecipeListSkeleton />}>
          <Await promise={getRecipes()}>
            {({ data }) => <RecipeList recipes={data.content?.slice(0, 4)} />}
          </Await>
        </Suspense>

        <Button variant="outlined" href={PAGES.RECIPES} color="primary">
          View all recipes
        </Button>
      </div>

      <div className="flex min-h-[600px] flex-row flex-wrap items-center justify-evenly gap-10 bg-white p-10">
        <Image
          src={recipeimage2}
          alt="food"
          quality={10}
          width={450}
          height={450}
        />
        <div className="flex max-w-[500px] flex-col gap-6">
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

      <div className="flex flex-col flex-wrap items-center justify-center gap-8 bg-gray-50 px-2 py-24">
        <Typography variant="h4" fontWeight="bold">
          PRICING
        </Typography>
        <div className="flex flex-row flex-wrap justify-center gap-6">
          <PricingCard title="Personal" description="Some random description" />
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
