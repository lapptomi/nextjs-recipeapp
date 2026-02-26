import { redirect } from "next/navigation";
import RecipeChatView from "../RecipeChatView";
import { ROUTES } from "@/types";

interface GenerateRecipeChatPageProps {
  readonly searchParams: Promise<{ prompt?: string | string[] }>;
}

export default async function GenerateRecipeChatPage({
  searchParams,
}: GenerateRecipeChatPageProps) {
  const params = await searchParams;
  const promptValue = Array.isArray(params.prompt) ? params.prompt[0] : params.prompt;
  const initialPrompt = promptValue?.trim();

  if (!initialPrompt) {
    redirect(ROUTES.GENERATE_RECIPE);
  }

  return <RecipeChatView initialPrompt={initialPrompt} />;
}
