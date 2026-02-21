import { getSession } from "@/lib/actions/auth";
import { ROUTES } from "@/types";
import { redirect } from "next/navigation";
import GenerateRecipePageClient from "./GenerateRecipePageClient";

export default async function GenerateRecipePage() {
  const session = await getSession();
  if (!session) {
    redirect(ROUTES.LOGIN);
  }

  return <GenerateRecipePageClient />;
}
