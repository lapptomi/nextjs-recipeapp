"use client";

import { useEffect, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box, Button, Typography } from "@mui/material";
import { useSelectedLayoutSegment } from "next/navigation";
import { getOpenAiStatus } from "@/lib/actions/openai";
import { ROUTES } from "@/types";

interface GenerateRecipeLayoutShellProps {
  readonly children: React.ReactNode;
}

export default function GenerateRecipeLayoutShell({ children }: GenerateRecipeLayoutShellProps) {
  const segment = useSelectedLayoutSegment();
  const isChatRoute = Boolean(segment);

  const [isAssistantOnline, setIsAssistantOnline] = useState(true);

  useEffect(() => {
    getOpenAiStatus()
      .then((isOnline) => setIsAssistantOnline(isOnline))
      .catch(() => setIsAssistantOnline(false));
  }, []);

  return (
    <Box
      className={isChatRoute ? "flex min-h-0 flex-1 flex-col bg-white" : "flex flex-col bg-white"}
    >
      <Box className="flex items-center gap-3 border-b border-gray-200 bg-white px-8 py-3">
        <Button startIcon={<ArrowBackIcon />} color="secondary" size="small" href={ROUTES.RECIPES}>
          Back
        </Button>
        {!isChatRoute && (
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
          <FiberManualRecordIcon
            className={isAssistantOnline ? "text-green-500 opacity-60" : "text-red-800 opacity-60"}
            sx={{ fontSize: 10 }}
          />
          <Typography variant="body2" color="text.secondary">
            Recipe Assistant
          </Typography>
        </Box>
      </Box>

      <Box className={isChatRoute ? "flex min-h-0 flex-1 overflow-hidden" : ""}>{children}</Box>
    </Box>
  );
}
