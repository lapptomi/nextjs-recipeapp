import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../../../lib/requireAuth";
import GenerateRecipePage from "./-GenerateRecipePage";

export const Route = createFileRoute("/recipes/generate/")({
  beforeLoad: requireAuth,
  component: GenerateRecipePage,
});
