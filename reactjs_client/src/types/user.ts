import type { RecipeListItem } from "./recipe";

export interface User {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  image: string | null;
  createdAt: Date;
  recipes: RecipeListItem[];
}
