"use client";

import { useState, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ROUTES } from "@/types";
import GenerateRecipeView from "./GenerateRecipeView";
import RecipeChatView from "./RecipeChatView";

export default function GenerateRecipePageClient() {
  const [chatPrompt, setChatPrompt] = useState<string | null>(null);

  const handleStartChat = useCallback((prompt: string) => {
    setChatPrompt(prompt);
  }, []);

  return (
    <Box
      className="flex flex-col bg-white"
      sx={chatPrompt ? { flex: 1, minHeight: 0, overflow: "hidden" } : {}}
    >
      {/* Shared header bar */}
      <Box className="flex items-center gap-3 border-b border-gray-200 bg-white px-8 py-3">
        <Button startIcon={<ArrowBackIcon />} color="secondary" size="small" href={ROUTES.RECIPES}>
          Back
        </Button>
        {!chatPrompt && (
          <>
            <Box className="h-6 w-px bg-gray-200" />
            <Box className="flex flex-col">
              <Typography variant="body1" className="font-bold">
                AI Recipe Generator
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Powered by AI
              </Typography>
            </Box>
          </>
        )}
        <Box className="ml-auto flex items-center gap-2">
          <Box className="size-2 rounded-full bg-green-500 opacity-60" />
          <Typography variant="body2" color="text.secondary">
            Recipe Assistant
          </Typography>
        </Box>
      </Box>

      {/* View content */}
      {chatPrompt ? (
        <RecipeChatView initialPrompt={chatPrompt} />
      ) : (
        <GenerateRecipeView onStartChat={handleStartChat} />
      )}
    </Box>
  );
}
