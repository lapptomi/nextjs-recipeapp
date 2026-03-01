"use client";

import { useEffect, useRef } from "react";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

import type { ChatMessage } from "./chatModel";
import GeneratedRecipeCard from "./GeneratedRecipeCard";

interface RecipeChatViewProps {
  messages: ChatMessage[];
  assistantThinking: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text?: string) => void;
  onAdjust: (adjustment: string) => void;
}

export default function RecipeChatView({
  messages,
  assistantThinking,
  input,
  onInputChange,
  onSend,
  onAdjust,
}: RecipeChatViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [assistantThinking, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  const canSend = input.trim().length > 0 && !assistantThinking;

  return (
    <Box className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-100">
      <Box ref={scrollContainerRef} className="flex-1 overflow-y-auto py-6">
        <Box className="mx-auto flex w-full max-w-[860px] flex-col gap-3 px-3">
          {messages.map((message) =>
            message.role === "user" ? (
              <Box key={message.id} className="flex items-start justify-end gap-3">
                <Box
                  className="max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm"
                  sx={{ backgroundColor: "secondary.main" }}
                >
                  <Typography variant="body1" color="text.primaryLight">
                    {message.content}
                  </Typography>
                </Box>
                <Box className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                  <Typography variant="body1" color="text.secondary">
                    You
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box key={message.id} className="flex items-start gap-3">
                <Box className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-secondary-main shadow-md">
                  <AutoAwesomeIcon className="text-xl text-white" />
                </Box>
                <Box className="flex min-w-0 flex-1 flex-col gap-6">
                  <Box className="max-w-[75%] rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5">
                    <Typography variant="body1" color="text.primary">
                      {message.content}
                    </Typography>
                  </Box>
                  {message.recipe && (
                    <GeneratedRecipeCard recipe={message.recipe} onAdjust={onAdjust} />
                  )}
                </Box>
              </Box>
            )
          )}
          {assistantThinking && (
            <Box className="flex items-start gap-3">
              <Box className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-secondary-main shadow-md">
                <AutoAwesomeIcon className="text-xl text-white" />
              </Box>
              <Box className="max-w-[75%] rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
                <Box className="flex items-center gap-1.5">
                  <Box className="size-2 animate-pulse rounded-full bg-gray-400" />
                  <Box className="size-2 animate-pulse rounded-full bg-gray-400 [animation-delay:150ms]" />
                  <Box className="size-2 animate-pulse rounded-full bg-gray-400 [animation-delay:300ms]" />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box className="border-t border-gray-200 bg-white p-5 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <Box className="mx-auto max-w-4xl">
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Describe what you'd like to cook next..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => onSend()}
                    disabled={!canSend}
                    color={canSend ? "primary" : "default"}
                  >
                    <SendIcon className="text-base" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="caption" color="textSecondary" className="mt-2 block text-center">
            {assistantThinking
              ? "AI is thinking..."
              : "Press Enter to send, Shift + Enter for new line"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
