import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import UserRecipes from "./UserRecipes";
import FollowersList from "./FollowersList";
import type { User } from "../../../../types/user";

interface Props {
  user: User;
}

type TabValue = "recipes" | "followers" | "following";

export default function UserTabs({ user }: Props) {
  const [activeTab, setActiveTab] = useState<TabValue>("recipes");

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, value: TabValue) => setActiveTab(value)}
        sx={{ borderBottom: "1px solid", borderColor: "grey.200", mb: 3 }}
      >
        <Tab label={`Recipes (${user.recipes.length})`} value="recipes" />
        <Tab label="Followers" value="followers" />
        <Tab label="Following" value="following" />
      </Tabs>

      {activeTab === "recipes" && <UserRecipes recipes={user.recipes} />}
      {activeTab === "followers" && (
        <FollowersList userId={user.id} type="followers" />
      )}
      {activeTab === "following" && (
        <FollowersList userId={user.id} type="following" />
      )}
    </Box>
  );
}
