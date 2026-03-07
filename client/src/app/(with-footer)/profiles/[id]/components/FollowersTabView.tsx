import { Avatar, Link, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";

import type { User } from "@/types";

interface FollowersTabViewProps {
  users: User[];
}

export default function FollowersTabView({ users }: FollowersTabViewProps) {
  return (
    <Container className="flex flex-col rounded-lg gap-2 p-4">
      {users.map((user) => (
        <Box key={user.id} className="flex items-center gap-2 rounded-lg bg-white p-4">
          <Avatar src={user.image ?? undefined} />
          <Box>
            <Link
              underline="hover"
              color="secondary"
              href={`/profiles/${user.id}`}
              variant="body1"
              fontWeight="medium"
            >
              {user.username}
            </Link>
            <Typography color="text.secondary" variant="body2">
              name or email?
            </Typography>
          </Box>
        </Box>
      ))}
    </Container>
  );
}
