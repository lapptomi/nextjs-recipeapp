"use client";

import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import RecipeChatSession from "./RecipeChatSession";

export default function GenerateRecipeView() {
  const [chatSessionKey, setChatSessionKey] = useState(0);
  const [hasActiveChat, setHasActiveChat] = useState(false);
  const [startInChatMode, setStartInChatMode] = useState(false);

  function handleBackToInitialView() {
    setHasActiveChat(false);
    setStartInChatMode(false);
    setChatSessionKey((prev) => prev + 1);
  }

  function handleNewChat() {
    setHasActiveChat(true);
    setStartInChatMode(true);
    setChatSessionKey((prev) => prev + 1);
  }

  return (
    <Box className="flex min-h-0 flex-1 flex-col bg-white">
      {hasActiveChat && (
        <Box className="flex items-center gap-3 border-b border-gray-200 bg-white px-3 py-3 sm:px-8">
          <Button
            startIcon={<ArrowBackIcon />}
            color="secondary"
            size="small"
            onClick={handleBackToInitialView}
          >
            Back
          </Button>
          <Box className="h-6 w-px bg-gray-200" />
          <Box className="flex flex-col">
            <Typography variant="body1" fontWeight="bold">
              AI Recipe Generator
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Powered by AI
            </Typography>
          </Box>
          <Box className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              variant="outlined"
              size="small"
              onClick={handleNewChat}
              sx={{ whiteSpace: "nowrap" }}
            >
              New Chat
            </Button>
          </Box>
        </Box>
      )}

      <Box className="flex min-h-0 flex-1 overflow-hidden">
        <RecipeChatSession
          key={chatSessionKey}
          startInChatMode={startInChatMode}
          onSessionActiveChange={setHasActiveChat}
        />
      </Box>
    </Box>
  );
}
