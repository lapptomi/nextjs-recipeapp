export const ChatRole = {
  User: "user",
  Assistant: "assistant",
} as const;

export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: string;
  adjustments: string[];
  category?: string;
}

export interface RecipeChatTurn {
  role: ChatRole;
  content: string;
  recipe?: GeneratedRecipe;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  recipe?: GeneratedRecipe;
}
