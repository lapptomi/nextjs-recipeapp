import CreateRecipeForm from "./CreateRecipeForm";
import { getSession } from "@/lib/actions/auth";
import { ROUTES } from "@/types";
import { redirect } from "next/navigation";

export default async function CreateRecipePage() {
  const session = await getSession();
  if (!session) {
    redirect(ROUTES.LOGIN);
  }

  return <CreateRecipeForm />;
}
