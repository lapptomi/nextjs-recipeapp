/* eslint-disable no-null/no-null */
import React from "react";

import { GroupAdd } from "@mui/icons-material";
import { Avatar, Button, Divider, Typography } from "@mui/material";
import axios from "axios";

import RecipeListItem from "@/components/RecipeListItem";
import TitleHeader from "@/components/TitleHeader";
import { BASE_URL } from "@/lib/constants";
import { recipesWithPreSignedUrl } from "@/lib/utils";

import styles from './page.module.css';

import type { UserIncludeRelations } from "@/types";

interface ProfilePageParams {
  params: {
    id: string;
  }
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const user = await axios.get<UserIncludeRelations>(`${BASE_URL}/api/users/${params.id}`)
    .then((response) => response.data)
    .catch((error) => console.log('ERROR = ', error));

  if (!user) {
    return <TitleHeader title="PROFILE NOT FOUND" />;
  }

  const recipes = await recipesWithPreSignedUrl(user.recipes);

  return (
    <div>
      <TitleHeader title={`PROFILE OF ${user.username}`.toUpperCase()} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 30,
      }}>
        <div style={{
          display: 'flex',
          gap: 20,        
        }}>

          <div style={{ 
            background: 'white',
            width: '50%',
            display: 'flex',
            flexDirection: 'row',
            padding: '30px',
            gap: '10px',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <div style={{
              width: 100,
              height: 100,
            }}>
              {/* TODO: add <Image /> here if user has profile picture */}
              <Avatar  style={{ width: '100%', height: '100%' }} />
            </div>
            
            <div>
              <Typography variant="h5">
                {user.username}
              </Typography>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
              }}>
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
          <div style={{ background: 'white', width: '50%' }}>
            <Typography variant="body1">
              Some random data here
            </Typography>
          </div>
        </div>

        <div style={{
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
          padding: 30,
        }}>
          <Divider>
            <Typography variant="h5">
              {recipes.length} PUBLIC RECIPES
            </Typography>
          </Divider>
          
          <div className={styles.container}>
            {recipes && recipes.length > 0 ? (
              <div className={styles.recipegrid}>
                {recipes.map((recipe) => (
                  <RecipeListItem key={recipe.id} recipe={recipe as any} />
                ))}
              </div>
            ) : (
              <div>
                <Typography variant="h4">No recipes found.</Typography>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;