import { Avatar, Box, Typography, styled } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { User } from "../../../../types/user";

const HeaderRoot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: "1px solid",
  borderColor: theme.palette.grey[200],
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  maxWidth: 900,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(4),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 96,
  height: 96,
  fontSize: 40,
  backgroundColor: theme.palette.primary.main,
}));

const StatsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
  marginTop: theme.spacing(0.5),
}));

interface Props {
  user: User;
}

export default function UserHeader({ user }: Props) {
  return (
    <HeaderRoot>
      <HeaderContent>
        <UserAvatar src={user.image ?? undefined}>
          {user.username[0].toUpperCase()}
        </UserAvatar>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            @{user.username}
          </Typography>

          {user.bio && (
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {user.bio}
            </Typography>
          )}

          <StatsRow>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <RestaurantIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {user.recipes.length} recipes
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </StatsRow>
        </Box>
      </HeaderContent>
    </HeaderRoot>
  );
}
