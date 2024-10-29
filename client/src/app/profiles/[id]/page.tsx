import React from "react";

import { GroupAdd } from "@mui/icons-material";
import { Avatar, Button, Divider, Typography } from "@mui/material";

import RecipeList from "@/components/RecipeList";
import TitleHeader from "@/components/TitleHeader";
import { findUserById } from "@/lib/actions/user";

interface ProfilePageParams {
  params: {
    id: string;
  }
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const user = await findUserById(params.id);

  if (!user) {
    return <TitleHeader title="PROFILE NOT FOUND" />;
  }

  const recipes = user.recipes ?? [];

  return (
    <div>
      <TitleHeader title={`PROFILE OF ${user.username}`.toUpperCase()} />
      <div className='flex flex-col gap-5 p-4'>
        <div className="flex gap-4">
          <div className='flex w-1/2 flex-wrap items-center justify-center gap-8 bg-white'>
            <div className='size-[120px]'>
              <Avatar className="size-full" />
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="h4">
                {user.username}
              </Typography>
              <div className='flex flex-row gap-4'>
                <div>
                  <Typography variant="caption">
                    Recipes
                  </Typography>
                  <Typography variant="body1">
                    {recipes.length}
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption">
                    Followers
                  </Typography>
                  <Typography variant="body1">
                    123
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption">
                    Following
                  </Typography>
                  <Typography variant="body1">
                    58
                  </Typography>
                </div>
              </div>

              <Button variant="contained" size="small">
                <GroupAdd /> Follow
              </Button>
            </div>
          </div>
          <div className='flex w-1/2 flex-wrap items-center justify-center gap-8 bg-white'>
            <Typography variant="body1">
              Some random data here
            </Typography>
          </div>
        </div>

        <div className='flex flex-col p-8'>
          <Divider>
            <Typography variant="h5">
              {recipes.length} PUBLIC RECIPES
            </Typography>
          </Divider>
          <RecipeList recipes={recipes} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;