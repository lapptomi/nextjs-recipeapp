import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../../../lib/requireAuth";
import CreateRecipePage from "./-CreateRecipePage";

export const Route = createFileRoute("/recipes/create/")({
  beforeLoad: requireAuth,
  component: CreateRecipePage,
});
