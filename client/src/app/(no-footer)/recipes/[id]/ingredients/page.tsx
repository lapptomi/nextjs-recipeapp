import { Container, Typography } from "@mui/material";

import { findRecipeById } from "@/lib/actions/recipe";

import IngredientsShoppingList from "./IngredientsShoppingList";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function IngredientsPage({ params }: Props) {
  const { id } = await params;
  const recipe = await findRecipeById(id);

  if (!recipe) {
    return (
      <Container>
        <Typography variant="h4" className="py-20 text-center">
          Recipe not found
        </Typography>
      </Container>
    );
  }

  return <IngredientsShoppingList recipe={recipe} />;
}
