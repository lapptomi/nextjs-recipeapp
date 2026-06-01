import { createFileRoute } from "@tanstack/react-router";
import { LinearProgress } from "@mui/material";
import { apiClient } from "../../../lib/apiClient";
import type { User } from "../../../types/user";
import UserPage from "./-UserPage";

export const Route = createFileRoute("/users/$id/")({
  loader: ({ params }): Promise<User> => apiClient.get(`/users/${params.id}`),
  pendingComponent: () => <LinearProgress color="primary" />,
  component: function RouteComponent() {
    const user = Route.useLoaderData();
    return <UserPage user={user} />;
  },
});
