/* eslint-disable no-null/no-null */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import { GroupAdd } from "@mui/icons-material";
import { Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

import { userActions } from "@/actions";
import RecipeListItem from "@/components/RecipeListItem";
import TitleHeader from "@/components/TitleHeader";

interface ProfilePageParams {
  params: {
    id: string;
  }
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const user = await userActions.findById(parseFloat(params.id));

  if (!user) {
    return <TitleHeader title="PROFILE NOT FOUND" />;
  }

  return (
    <div>
      <TitleHeader title={`PROFILE OF ${user?.username}`.toUpperCase()} />

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
              <Avatar
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            
            <div>
              <Typography variant="h5">
                {user?.username}
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
                    {user.recipes.length}
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
          padding: 30,
        }}>
          <Divider>
            <Typography variant="h5">
              {user.recipes.length} PUBLIC RECIPES
            </Typography>
          </Divider>
          
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            flexWrap: 'wrap',          
          }}>
            {user.recipes.map((recipe) => (
              <div key={recipe.id}>
                {/* TODO: Add image background */}
                <RecipeListItem
                  key={recipe.id}
                  recipe={{
                    ...recipe,
                    image: null,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,       
          background: 'white', 
        }}>
          {user.recipes.map((recipe) => (
            <List
              key={recipe.id}
              sx={{ width: '100%' }}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={recipe.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {recipe.createdAt.toISOString()}
                      </Typography>
                      {`- ${recipe.description}`}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;