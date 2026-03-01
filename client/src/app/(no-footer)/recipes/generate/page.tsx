import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/auth";
import { ROUTES } from "@/types";
import GenerateRecipeView from "./GenerateRecipeView";

export default async function GenerateRecipePage() {
  const session = await getSession();
  if (!session) {
    redirect(ROUTES.LOGIN);
  }

  return <GenerateRecipeView />;
}
