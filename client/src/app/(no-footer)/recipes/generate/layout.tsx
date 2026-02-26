import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/auth";
import { ROUTES } from "@/types";
import GenerateRecipeLayoutShell from "./GenerateRecipeLayoutShell";

interface GenerateRecipeLayoutProps {
  readonly children: React.ReactNode;
}

export default async function GenerateRecipeLayout({ children }: GenerateRecipeLayoutProps) {
  const session = await getSession();
  if (!session) {
    redirect(ROUTES.LOGIN);
  }

  return <GenerateRecipeLayoutShell>{children}</GenerateRecipeLayoutShell>;
}
