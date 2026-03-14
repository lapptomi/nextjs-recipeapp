"use client";

import { useEffect, useRef, useState } from "react";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

import { ChatRole } from "@/types";
import type { ChatMessage, GeneratedRecipe } from "@/types";
import GeneratedRecipeCard from "./GeneratedRecipeCard";

interface RecipeChatViewProps {
  messages: ChatMessage[];
  assistantThinking: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (message: string) => void;
  onAdjust: (adjustment: string) => void;
}

interface RecipeVersionCardProps {
  recipe: GeneratedRecipe;
  version: number;
  selected: boolean;
  saved: boolean;
  onClick: () => void;
}

function RecipeVersionCard({ recipe, version, selected, saved, onClick }: RecipeVersionCardProps) {
  return (
    <Box
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-xl border bg-white px-4 py-3 transition-colors"
      sx={{
        borderColor: selected ? "primary.main" : "grey.200",
        borderWidth: selected ? 2 : 1,
        "&:hover": { borderColor: selected ? "primary.main" : "grey.400" },
        "&:hover .undo-icon": { color: "primary.main" },
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight="medium">
          {recipe.title}
        </Typography>
        <Box className="flex items-center gap-2">
          <Typography variant="caption" color="text.secondary">
            Version {version}
          </Typography>
          {saved && (
            <Typography variant="caption" color="success.main" fontWeight="medium">
              Saved
            </Typography>
          )}
        </Box>
      </Box>
      {selected ? (
        <Typography variant="caption" color="primary" fontWeight="bold">
          Selected
        </Typography>
      ) : (
        <UndoIcon
          className="undo-icon"
          sx={{ fontSize: 18, color: "text.disabled", transition: "color 0.2s" }}
        />
      )}
    </Box>
  );
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
  const [selectedMessageId, setSelectedMessageId] = useState<string | undefined>(undefined);
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());

  // Pre-compute version numbers for each recipe-bearing message
  let versionCounter = 0;
  const messageVersions = new Map<string, number>();
  for (const msg of messages) {
    if (msg.role === ChatRole.Assistant && msg.recipe) {
      versionCounter++;
      messageVersions.set(msg.id, versionCounter);
    }
  }

  const recipeMessages = messages.filter((m) => m.role === ChatRole.Assistant && m.recipe);
  const latestRecipeMessage =
    recipeMessages.length > 0 ? recipeMessages[recipeMessages.length - 1] : undefined;

  // Auto-select the latest recipe when a new one arrives
  useEffect(() => {
    if (latestRecipeMessage) {
      setSelectedMessageId(latestRecipeMessage.id);
    }
  }, [latestRecipeMessage?.id]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [assistantThinking, messages]);

  const handlePressEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
    }
  };
  const canSend = input.trim().length > 0 && !assistantThinking;

  const selectedMessage = recipeMessages.find((m) => m.id === selectedMessageId);

  return (
    <Box className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      {/* Left: Chat panel */}
      <Box className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-100 md:w-[500px] md:flex-none md:border-r md:border-gray-200">
        <Box ref={scrollContainerRef} className="flex-1 overflow-y-auto py-6">
          <Box className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-3 md:max-w-none">
            {messages.map((message) => {
              if (message.role === ChatRole.User) {
                return (
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
                );
              }

              // Assistant message
              const version = message.recipe ? messageVersions.get(message.id) : undefined;
              const isSelected = message.id === selectedMessageId;

              return (
                <Box key={message.id} className="flex items-start gap-3">
                  <Box className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-secondary-main shadow-md">
                    <AutoAwesomeIcon className="text-xl text-white" />
                  </Box>
                  <Box className="flex min-w-0 flex-1 flex-col gap-3">
                    <Box className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5">
                      <Typography variant="body1" color="text.primary">
                        {message.content}
                      </Typography>
                    </Box>
                    {message.recipe && version !== undefined && (
                      <>
                        {/* Clickable version card on desktop */}
                        <Box className="hidden md:block">
                          <RecipeVersionCard
                            recipe={message.recipe}
                            version={version}
                            selected={isSelected}
                            saved={savedMessageIds.has(message.id)}
                            onClick={() => setSelectedMessageId(message.id)}
                          />
                        </Box>
                        {/* Full recipe card on mobile */}
                        <Box className="md:hidden">
                          <GeneratedRecipeCard recipe={message.recipe} onAdjust={onAdjust} />
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              );
            })}

            {assistantThinking && (
              <Box className="flex items-start gap-3">
                <Box className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-secondary-main shadow-md">
                  <AutoAwesomeIcon className="text-xl text-white" />
                </Box>
                <Box className="max-w-[75%] rounded-2xl border border-gray-200 bg-white px-5 py-4">
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

        <Box className="border-t border-gray-200 bg-white p-5">
          <Box className="mx-auto max-w-4xl md:max-w-none">
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Describe what you'd like to cook next..."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handlePressEnter}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => onSend(input)}
                      disabled={!canSend}
                      color={canSend ? "primary" : "default"}
                    >
                      <SendIcon />
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

      {/* Right: Recipe panel (desktop only) */}
      <Box className="hidden flex-1 flex-col overflow-hidden md:flex">
        <Box className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {recipeMessages.length === 0 ? (
            <Box className="flex h-full items-center justify-center">
              <Box className="text-center">
                <AutoAwesomeIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
                <Typography variant="body1" color="text.secondary">
                  Your generated recipe will appear here
                </Typography>
              </Box>
            </Box>
          ) : (
            recipeMessages.map((msg) => (
              <Box key={msg.id} sx={{ display: msg.id === selectedMessageId ? "block" : "none" }}>
                <GeneratedRecipeCard
                  recipe={msg.recipe!}
                  onAdjust={onAdjust}
                  onSave={() => setSavedMessageIds((prev) => new Set(prev).add(msg.id))}
                />
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
