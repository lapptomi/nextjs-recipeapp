import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "../../../pages/Register";

export const Route = createFileRoute('/auth/register/')({
  component: RegisterPage,
});
