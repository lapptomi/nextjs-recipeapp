"use client";

import { Button } from "@mui/material";
import { Box } from "@mui/system";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { User } from "@/types";
import { followUser, unfollowUser } from "@/lib/actions/user";
import { useSession } from "next-auth/react";

export default function ProfileHeaderButtons({
  user,
  userFollowers,
}: {
  user: User;
  userFollowers: User[];
}) {
  const { data: session } = useSession();
  const isFollowing = userFollowers.some((f) => Number(f.id) === Number(session?.user.id));

  if (!session?.user || Number(session?.user.id) === user.id) {
    return null;
  }

  const handleFollow = async () => {
    await followUser(user.id);
    window.location.reload();
  };

  const handleUnfollow = async () => {
    await unfollowUser(user.id);
    window.location.reload();
  };

  return (
    <Box className="flex gap-3">
      <Button
        color={isFollowing ? "secondary" : "primary"}
        variant={isFollowing ? "outlined" : "contained"}
        startIcon={<PersonAddIcon />}
        onClick={isFollowing ? handleUnfollow : handleFollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </Box>
  );
}
