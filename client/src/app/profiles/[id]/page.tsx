import React from "react";

import { GroupAdd } from "@mui/icons-material";
import { Avatar, Button, Divider, Typography } from "@mui/material";
import axios from "axios";

import RecipeList from "@/components/RecipeList";
import TitleHeader from "@/components/TitleHeader";
import { API_ROOT, NEXT_APP_API_URL } from "@/lib/constants";

import styles from './page.module.css';

import type { User } from "@/types";

interface ProfilePageParams {
  params: {
    id: string;
  }
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const response = await axios.get<User>(`${NEXT_APP_API_URL}/${API_ROOT}/users/${params.id}`);
  const user = response.data;

  if (!user) {
    return <TitleHeader title="PROFILE NOT FOUND" />;
  }

  const recipes = user.recipes ?? [];

  return (
    <div>
      <TitleHeader title={`PROFILE OF ${user.username}`.toUpperCase()} />
      <div className={styles.maincontainer}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className={styles.profileheader}>
            <div className={styles.profilepicture}>
              <Avatar style={{ width: '100%', height: '100%' }} />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <Typography variant="h5">
                {user.username}
              </Typography>
              <div className={styles.infocontainer}>
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