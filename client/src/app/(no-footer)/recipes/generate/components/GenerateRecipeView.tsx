"use client";

import { useCallback, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import RecipeChatSession from "./RecipeChatSession";

export default function GenerateRecipeView() {
  const [chatSessionKey, setChatSessionKey] = useState(0);
  const [hasActiveChat, setHasActiveChat] = useState(false);
  const [startInChatMode, setStartInChatMode] = useState(false);

  const handleBackToInitialView = useCallback(() => {
    setHasActiveChat(false);
    setStartInChatMode(false);
    setChatSessionKey((prev) => prev + 1);
  }, []);

  const handleNewChat = useCallback(() => {
    setHasActiveChat(true);
    setStartInChatMode(true);
    setChatSessionKey((prev) => prev + 1);
  }, []);

  return (
    <Box className="flex min-h-0 flex-1 flex-col bg-white">
      {hasActiveChat && (
        <Box className="flex items-center gap-3 border-b border-gray-200 bg-white px-8 py-3">
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
            <Typography variant="body1" className="font-bold">
              AI Recipe Generator
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Powered by AI
            </Typography>
          </Box>
          <Box className="ml-auto flex items-center gap-2">
            <Button variant="outlined" size="small" onClick={handleNewChat}>
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
