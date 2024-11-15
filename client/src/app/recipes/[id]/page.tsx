import { AccessTime, Person, Restaurant } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import LikeButtons from "@/components/LikeButtons";
import RecipeCommentForm from "@/components/RecipeCommentForm";
import TitleHeader from "@/components/TitleHeader";
import { getSession } from "@/lib/actions/auth";
import { findRecipeById } from "@/lib/actions/recipe";
import { PAGES } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

const RecipePage = async ({ params }: Props) => {
  const session = await getSession();
  const recipeId = (await params).id;
  const recipe = await findRecipeById(recipeId);

  if (!recipe) {
    return <TitleHeader title="Recipe not found" />;
  }

  const likes = recipe.ratings.filter((r) => r.type === "LIKE").length;
  const dislikes = recipe.ratings.filter((r) => r.type === "DISLIKE").length;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full max-w-[1920px] flex-wrap items-center justify-between">
        <div className="flex w-full flex-row flex-wrap justify-evenly bg-gradient-to-l from-gray-50 p-12">
          <div className="flex flex-col justify-center gap-3">
            <Typography variant="h3" fontWeight="medium">
              {recipe.title.toUpperCase()}
            </Typography>
            <Link href={`${PAGES.PROFILES}/${recipe.author.id}`}>
              <div className="flex flex-row items-center gap-4">
                <Avatar className="size-20" />
                <div>
                  <Typography variant="subtitle1">Created By</Typography>
                  <Typography variant="h5">{recipe.author.username}</Typography>
                  <Rating value={(likes / (likes + dislikes)) * 5} readOnly />
                </div>
              </div>
            </Link>
            <LikeButtons session={session} recipe={recipe} />
          </div>

          <div className="size-[440px]">
            {recipe.image ? (
              <Image src={recipe.image} alt={recipe.title} layout="fill" />
            ) : (
              <Restaurant className="size-full bg-gray-400 opacity-5" />
            )}
          </div>
        </div>

        <div className="flex min-h-[400px] w-full flex-col justify-center gap-10 p-10">
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

          <Typography
            variant="body1"
            className="whitespace-pre-wrap break-words"
          >
            {recipe.description}
          </Typography>

          <Divider>
            <Typography variant="h5">INGREDIENTS</Typography>
          </Divider>

          <List dense={true}>
            {recipe.ingredients.map((ingredient, index: number) => (
              <ListItem key={ingredient}>
                <Typography key={index} variant="body2">
                  - {ingredient} <br />
                </Typography>
              </ListItem>
            ))}
          </List>

          <Divider>
            <Typography variant="h5">INSTRUCTIONS</Typography>
          </Divider>
          <Typography
            variant="body2"
            className="whitespace-pre-wrap break-words"
          >
            {recipe.instructions}
          </Typography>

          <div>
            <List className="flex w-full flex-col">
              <Divider>
                <Typography variant="body1">
                  {recipe.comments.length} COMMENTS
                </Typography>
              </Divider>
              {(recipe.comments ?? []).map((comment, index: number) => (
                <ListItem key={index} className="my-2 bg-gray-50 p-3">
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    className="whitespace-pre-wrap break-words"
                    primary={
                      <Typography variant="body1">
                        <Tooltip
                          title={`View profile of ${comment.author.username}`}
                        >
                          <Link href={`${PAGES.PROFILES}/${comment.author.id}`}>
                            {comment.author.username}-
                            <Typography variant="caption">
                              {comment.createdAt &&
                                new Date(comment.createdAt)
                                  .toISOString()
                                  .split("T")[0]}
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

            {session?.user && recipe ? (
              <RecipeCommentForm recipe={recipe} />
            ) : (
              <Typography variant="body1">
                Please sign in to comment...
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
