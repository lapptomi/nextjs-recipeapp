"use client";

import RecipeGridSkeleton from "@/components/RecipeGridSkeleton";
import RecipeListCardSmall from "@/components/RecipeListCardSmall";
import { RecipeListItem, User } from "@/types";
import { Tabs, Tab, Avatar, Typography, Link } from "@mui/material";
import { Container, Box } from "@mui/system";
import { Suspense, useState } from "react";

const FollowersTabView = ({ users }: { users: User[] }) => {
  return (
    <Container className="flex flex-col  p-4 rounded-lg gap-2">
      {users.map((user: User) => (
        <Box key={user.id} className="flex items-center gap-2 bg-white p-4 rounded-lg">
          <Avatar src={user.image ?? undefined} />
          <Box>
            <Link
              underline="hover"
              color="secondary"
              href={`/profiles/${user.id}`}
              variant="body1"
              fontWeight="medium"
            >
              {user.username}
            </Link>
            <Typography color="text.secondary" variant="body2">
              {user.email}
            </Typography>
          </Box>
        </Box>
      ))}
    </Container>
  );
};

export default function ProfileTabViews({
  user,
  followers,
  following,
}: {
  user: User;
  followers: User[];
  following: User[];
}) {
  const CARD_WIDTH = 280;
  const CARD_GAP = 24;

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
        <Suspense fallback={<RecipeGridSkeleton cardWidth={CARD_WIDTH} cardGap={CARD_GAP} />}>
          {user.recipes.length > 0 ? (
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
