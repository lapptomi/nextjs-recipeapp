import React from "react";

import { GroupAdd } from "@mui/icons-material";
import { Avatar, Button, Divider, Typography } from "@mui/material";
import axios from "axios";

import RecipeList from "@/components/RecipeList";
import TitleHeader from "@/components/TitleHeader";
import { BASE_URL } from "@/lib/constants";

import styles from './page.module.css';

import type { User } from "@/types";

interface ProfilePageParams {
  params: {
    id: string;
  }
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const response = await axios.get<User>(`${BASE_URL}/api/users/${params.id}`);
  const user = response.data;

  if (!user) {
    return <TitleHeader title="PROFILE NOT FOUND" />;
  }

  const recipes = user.recipes;

  return (
    <div>
      <TitleHeader title={`PROFILE OF ${user.username}`.toUpperCase()} />
      <div className={styles.maincontainer}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div className={styles.profileheader}>
            <div className={styles.profilepicture}>
              {/* TODO: add <Image /> here if user has profile picture */}
              <Avatar style={{ width: '100%', height: '100%' }} />
            </div>
            
            <div>
              <Typography variant="h5">
                {user.username}
              </Typography>
              <div className={styles.infocontainer}>
                <div>
                  <Typography variant="caption">
                    Recipes
                  </Typography>
                  <Typography variant="h6">
                    {recipes.length}
                  </Typography>
                </div>
              
                <div>
                  <Typography variant="caption">
                   Followers
                  </Typography>
                  <Typography variant="h6">
                    123
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption">
                    Following
                  </Typography>
                  <Typography variant="h6">
                    58
                  </Typography>
                </div>
              </div>
              
              <Button variant="contained" size="small">
                <GroupAdd />
                Follow
              </Button>
            </div>
          </div>
          <div className={styles.profileheader}>
            <Typography variant="body1">
              Some random data here
            </Typography>
          </div>
        </div>

        <div className={styles.recipelist}>
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