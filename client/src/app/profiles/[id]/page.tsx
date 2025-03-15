import React from "react";

import { GroupAdd } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";

import RecipeList from "@/components/RecipeList";
import TitleHeader from "@/components/TitleHeader";
import { findUserById } from "@/lib/actions/user";

interface ProfilePageParams {
  params: Promise<{ id: string }>;
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const userId = (await params).id;
  const user = await findUserById(userId);

  if (!user) {
    return <TitleHeader title="PROFILE NOT FOUND" />;
  }

  const recipes = user.recipes ?? [];

  return (
    <Box>
      <TitleHeader title={`PROFILE OF ${user.username}`.toUpperCase()} />
      <Box className="flex flex-col gap-5 p-4">
        <Box className="flex gap-4">
          <Box className="flex w-1/2 flex-wrap items-center justify-center gap-8 bg-white">
            <Box className="size-[120px]">
              <Avatar className="size-full" />
            </Box>

            <Box className="flex flex-col gap-2">
              <Typography variant="h4">{user.username}</Typography>
              <Box className="flex flex-row gap-4">
                <Box>
                  <Typography variant="caption">Recipes</Typography>
                  <Typography variant="body1">{recipes.length}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption">Followers</Typography>
                  <Typography variant="body1">123</Typography>
                </Box>

                <Box>
                  <Typography variant="caption">Following</Typography>
                  <Typography variant="body1">58</Typography>
                </Box>
              </Box>

              <Button variant="contained" size="small">
                <GroupAdd /> Follow
              </Button>
            </Box>
          </Box>
          <Box className="flex w-1/2 flex-wrap items-center justify-center gap-8 bg-white">
            <Typography variant="body1">Some random data here</Typography>
          </Box>
        </Box>

        <Box className="flex flex-col p-8">
          <Divider>
            <Typography variant="h5">
              {recipes.length} PUBLIC RECIPES
            </Typography>
          </Divider>
          <RecipeList recipes={recipes} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
