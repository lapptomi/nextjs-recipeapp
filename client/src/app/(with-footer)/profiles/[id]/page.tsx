import { Avatar, Box, Container, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { fetchUserFollowers, fetchUserFollowing, findUserById } from "@/lib/actions/user";
import ProfileHeaderButtons from "./ProfileHeaderButtons";
import ProfileTabViews from "./ProfileTabViews";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const userId = (await params).id;
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const userFollowers = await fetchUserFollowers(Number(userId));
  const userFollowing = await fetchUserFollowing(Number(userId));

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="border-b border-gray-200 bg-white px-24">
        <Container maxWidth="xl" className="py-12">
          <Box className="flex items-start gap-8">
            <Box className="relative">
              <Avatar
                className="size-[120px] bg-orange-300 text-5xl font-bold"
                src={user.image ?? undefined}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
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
                      <CalendarTodayIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <ProfileHeaderButtons user={user} userFollowers={userFollowers} />
              </Box>

              <Typography
                variant="body1"
                className="mb-6"
                color="text.secondary"
                maxWidth="650px"
                lineHeight={1.6}
              >
                {user.bio}
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
                    {userFollowers.length}
                  </Typography>
                  <Typography variant="body2" className="font-medium" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography variant="h5" className="font-bold" color="text.primary">
                    {userFollowing.length}
                  </Typography>
                  <Typography variant="body2" className="font-medium" color="text.secondary">
                    Following
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography variant="h5" className="font-bold" color="text.primary">
                    {user.recipes.reduce((acc, recipe) => acc + recipe.totalRatings, 0)}
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

      <ProfileTabViews user={user} followers={userFollowers} following={userFollowing} />
    </Box>
  );
}
