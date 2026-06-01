import { Box, Container } from "@mui/material";
import type { User } from "../../../types/user";
import UserHeader from "./-components/UserHeader";
import UserTabs from "./-components/UserTabs";

interface Props {
  user: User;
}

export default function UserPage({ user }: Props) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <UserHeader user={user} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <UserTabs user={user} />
      </Container>
    </Box>
  );
}
