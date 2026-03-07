"use client";

import { Suspense, useState } from "react";

import { Tab, Tabs, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";

import RecipeListCardSmall from "@/components/RecipeListCardSmall";
import type { RecipeListItem, User } from "@/types";

import FollowersTabView from "./FollowersTabView";
import RecipeGridSkeleton from "./RecipeGridSkeleton";

interface ProfileTabViewsProps {
  user: User;
  followers: User[];
  following: User[];
}

export default function ProfileTabViews({ user, followers, following }: ProfileTabViewsProps) {
  const cardWidth = 280;
  const cardGap = 24;

  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6">
        <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
          <Tab label={`Recipes (${user.recipes.length})`} tabIndex={0} />
          <Tab label={`Followers (${followers.length})`} tabIndex={1} />
          <Tab label={`Following (${following.length})`} tabIndex={2} />
          <Tab label="Saved" tabIndex={2} disabled />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Suspense fallback={<RecipeGridSkeleton cardWidth={cardWidth} cardGap={cardGap} />}>
          {user.recipes.length > 0 ? (
            <Box
              className="grid justify-center"
              sx={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${cardWidth}px, ${cardWidth}px))`,
                gap: `${cardGap}px`,
              }}
            >
              {user.recipes.map((recipe: RecipeListItem) => (
                <RecipeListCardSmall key={recipe.id} recipe={recipe} />
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" variant="h6">
              No recipes found.
            </Typography>
          )}
        </Suspense>
      )}
      {activeTab === 1 && <FollowersTabView users={followers} />}
      {activeTab === 2 && <FollowersTabView users={following} />}
    </Container>
  );
}
