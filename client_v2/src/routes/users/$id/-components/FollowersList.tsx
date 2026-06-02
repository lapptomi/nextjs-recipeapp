import { Link } from "@tanstack/react-router";
import { Avatar, Box, Typography, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../lib/apiClient";

const FollowerCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.paper,
  border: "1px solid",
  borderColor: theme.palette.grey[200],
  "&:hover": { borderColor: theme.palette.primary.main },
}));

interface UserSummary {
  id: number;
  username: string;
  image: string | null;
}

interface Props {
  userId: number;
  type: "followers" | "following";
}

export default function FollowersList({ userId, type }: Props) {
  const { data: users, isLoading } = useQuery<UserSummary[]>({
    queryKey: [type, userId],
    queryFn: (): Promise<UserSummary[]> =>
      apiClient.get(`/users/${userId}/${type}`).catch(() => []),
  });

  if (isLoading) return null;

  if (!users?.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          No {type} yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {users.map((user) => (
        <Link
          key={user.id}
          to="/users/$id"
          params={{ id: String(user.id) }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <FollowerCard>
            <Avatar
              src={user.image ?? undefined}
              sx={{ bgcolor: "primary.main" }}
            >
              {user.username[0].toUpperCase()}
            </Avatar>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              @{user.username}
            </Typography>
          </FollowerCard>
        </Link>
      ))}
    </Box>
  );
}
