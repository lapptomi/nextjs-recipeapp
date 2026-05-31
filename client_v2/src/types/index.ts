export interface RecipeListItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  cookingTime: number;
  servings: number;
  author: { id: number; username: string };
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  category: string | null;
}

export interface RecipeComment {
  id: number;
  message: string;
  author: { id: number; username: string };
  createdAt: string | null;
}

export interface RecipeRating {
  id: number;
  type: "LIKE" | "DISLIKE";
  userId: number;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  servings: number;
  image: string | null;
  author: { id: number; username: string };
  comments: RecipeComment[];
  ratings: RecipeRating[];
  createdAt: Date;
  category: string | null;
}
