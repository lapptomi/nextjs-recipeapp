import { Suspense } from "react";
import { Avatar, Box, Button, Container, Tab, Tabs, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedIcon from "@mui/icons-material/Verified";

import type { RecipeListItem } from "@/types";
import { findUserById } from "@/lib/actions/user";
import TitleHeader from "@/components/TitleHeader";
import RecipeListCardSmall from "@/components/RecipeListCardSmall";
import RecipeGridSkeleton from "@/components/RecipeGridSkeleton";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const userId = (await params).id;
  const user = await findUserById(userId);

  if (!user) {
    return <TitleHeader title="404" />;
  }

  const CARD_WIDTH = 280;
  const CARD_GAP = 24;

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="border-b border-gray-200 bg-white px-24">
        <Container maxWidth="xl" className="py-12">
          <Box className="flex items-start gap-8">
            <Box className="relative">
              <Avatar className="size-[120px] bg-orange-300 text-5xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <VerifiedIcon
                className="absolute -bottom-0 -right-0 flex size-8 items-center justify-center rounded-full"
                color="primary"
              />
            </Box>

            <Box className="flex-1">
              <Box className="mb-6 flex items-start justify-between">
                <Box>
                  <Typography variant="h4" className="mb-1 font-bold" color="text.primary">
                    {user.username}
                  </Typography>
                  <Typography variant="body1" className="mb-2" color="text.secondary">
                    @username or email?
                  </Typography>
                  <Box className="flex items-center gap-4">
                    <Box className="flex items-center gap-1">
                      <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Helsinki, Finland
                      </Typography>
                    </Box>
                    <Box className="flex items-center gap-1">
                      <CalendarTodayIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Joined January 2024
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="flex gap-3">
                  <Button variant="contained" startIcon={<PersonAddIcon />}>
                    Follow
                  </Button>
                  <Button variant="outlined" color="secondary">
                    Message
                  </Button>
                </Box>
              </Box>

              <Typography
                variant="body1"
                className="mb-6"
                color="text.secondary"
                maxWidth="650px"
                lineHeight={1.6}
              >
                Home cook & food enthusiast 🍳 Sharing my favorite recipes from around the world.
                Love experimenting with new flavors!
              </Typography>

              <Box className="flex gap-8 border-t pt-6">
                <Box className="text-center">
                  <Typography variant="h5" className="font-bold" color="text.primary">
                    {user.recipes.length}
                  </Typography>
                  <Typography variant="body2" className="font-medium" color="text.secondary">
                    Recipes
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography variant="h5" className="font-bold" color="text.primary">
                    1,256
                  </Typography>
                  <Typography variant="body2" className="font-medium" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography variant="h5" className="font-bold" color="text.primary">
                    432
                  </Typography>
                  <Typography variant="body2" className="font-medium" color="text.secondary">
                    Following
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography variant="h5" className="font-bold" color="text.primary">
                    3,421
                  </Typography>
                  <Typography variant="body2" className="font-medium" color="text.secondary">
                    Total Likes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" className="py-8">
        <Box className="mb-6">
          <Tabs
            value={0}
            sx={{
              "& .MuiTabs-indicator": {
                bgcolor: "primary.main",
                height: 3,
              },
            }}
          >
            <Tab
              label="Recipes"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "text.primary",
                },
              }}
            />
            <Tab
              label="Liked"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "text.primary",
                },
              }}
            />
            <Tab
              label="Saved"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "text.primary",
                },
              }}
            />
          </Tabs>
        </Box>

        <Suspense fallback={<RecipeGridSkeleton cardWidth={CARD_WIDTH} cardGap={CARD_GAP} />}>
          <Box
            className="grid justify-center"
            sx={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
              gap: `${CARD_GAP}px`,
            }}
          >
            {user.recipes.map((recipe: RecipeListItem) => (
              <RecipeListCardSmall key={recipe.id} recipe={recipe} />
            ))}
          </Box>
        </Suspense>
      </Container>
    </Box>
  );
}
