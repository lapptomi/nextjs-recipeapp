import type { GeneratedRecipe } from "@/lib/actions/openai";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recipe?: GeneratedRecipe;
}
